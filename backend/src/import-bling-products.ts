import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Função para gerar slug a partir do nome
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens duplicados
    .replace(/^-+|-+$/g, "") // Remove hífens no início/fim
    .substring(0, 100); // Limita a 100 caracteres
}

// Função para parsear CSV (formato do Bling usa ; como separador)
function parseCSV(content: string): any[] {
  const lines = content.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  // Primeira linha = cabeçalho
  const headers = lines[0].split(";").map((h) => h.replace(/"/g, "").trim());

  const products = [];

  // Processar cada linha
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(";").map((v) => v.replace(/"/g, "").trim());

    const product: any = {};
    headers.forEach((header, index) => {
      product[header] = values[index] || "";
    });

    products.push(product);
  }

  return products;
}

// Função para mapear categoria do Bling para categorias do sistema
async function getCategoryId(blingCategory: string): Promise<string> {
  const categoryMap: { [key: string]: string } = {
    motor: "motor",
    freio: "freios",
    freios: "freios",
    suspensao: "suspensao",
    suspensão: "suspensao",
    eletrica: "eletrica",
    elétrica: "eletrica",
    filtro: "filtros",
    filtros: "filtros",
    oleo: "oleo-e-fluidos",
    óleo: "oleo-e-fluidos",
    fluido: "oleo-e-fluidos",
  };

  // Normalizar categoria
  const normalized = blingCategory
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Buscar palavra-chave
  for (const [key, slug] of Object.entries(categoryMap)) {
    if (normalized.includes(key)) {
      const category = await prisma.category.findUnique({ where: { slug } });
      if (category) return category.id;
    }
  }

  // Se não encontrar, usar categoria "Outros"
  let otherCategory = await prisma.category.findUnique({
    where: { slug: "outros" },
  });

  if (!otherCategory) {
    otherCategory = await prisma.category.create({
      data: {
        name: "Outros",
        slug: "outros",
        description: "Produtos sem categoria definida",
      },
    });
  }

  return otherCategory.id;
}

async function main() {
  console.log("🚀 Iniciando importação de produtos do Bling...\n");

  // Ler todos os arquivos CSV da pasta 'imports'
  const importsDir = path.join(__dirname, "..", "imports");

  if (!fs.existsSync(importsDir)) {
    console.error('❌ Pasta "imports" não encontrada!');
    console.log("📁 Crie a pasta: backend/imports/");
    console.log("📄 Cole os arquivos CSV do Bling lá dentro.");
    return;
  }

  const files = fs.readdirSync(importsDir).filter((f) => f.endsWith(".csv"));

  if (files.length === 0) {
    console.error("❌ Nenhum arquivo CSV encontrado na pasta imports/");
    return;
  }

  console.log(`📦 Encontrados ${files.length} arquivo(s) CSV:\n`);
  files.forEach((f) => console.log(`   - ${f}`));
  console.log("");

  let totalImported = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const file of files) {
    console.log(`\n📄 Processando: ${file}`);
    console.log("─".repeat(50));

    const filePath = path.join(importsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const products = parseCSV(content);

    console.log(`   Produtos no arquivo: ${products.length}`);

    for (let i = 0; i < products.length; i++) {
      const row = products[i];

      try {
        // Validar dados obrigatórios
        if (!row["Código"] || !row["Descrição"]) {
          console.log(
            `   ⚠️  Linha ${i + 2}: Código ou Descrição vazio - PULADO`,
          );
          totalSkipped++;
          continue;
        }

        // Limpar SKU (remover espaços, tabs, quebras de linha)
        const sku = row["Código"].replace(/\s+/g, "").trim();
        if (!sku) {
          totalSkipped++;
          continue;
        }

        // Verificar se produto já existe
        const existing = await prisma.product.findUnique({ where: { sku } });
        if (existing) {
          console.log(`   ⏭️  SKU ${sku}: Já existe - PULADO`);
          totalSkipped++;
          continue;
        }

        // Preparar dados
        const name = row["Descrição"].substring(0, 255); // Limitar tamanho
        const slug = generateSlug(name);
        const price = parseFloat(row["Preço"].replace(",", ".")) || 0;
        const stock = parseInt(row["Estoque"]) || 0;
        const description =
          row["Descrição Complementar"] || row["Descrição Curta"] || name;
        const imageUrl = row["URL Imagens Externas"] || null;
        const blingCategory = row["Categoria do produto"] || "";

        // Obter categoria
        const categoryId = await getCategoryId(blingCategory);

        // Verificar se slug já existe (adicionar número se necessário)
        let finalSlug = slug;
        let counter = 1;
        while (
          await prisma.product.findUnique({ where: { slug: finalSlug } })
        ) {
          finalSlug = `${slug}-${counter}`;
          counter++;
        }

        // Criar produto
        await prisma.product.create({
          data: {
            name,
            slug: finalSlug,
            sku,
            description,
            price,
            stock,
            imageUrl,
            categoryId,
            isActive: stock > 0, // Ativo apenas se tiver estoque
            salePrice: null,
          },
        });

        totalImported++;

        if ((i + 1) % 50 === 0) {
          console.log(
            `   ✅ Importados: ${totalImported} | Pulados: ${totalSkipped}`,
          );
        }
      } catch (error: any) {
        totalErrors++;
        console.error(`   ❌ Erro na linha ${i + 2}:`, error.message);
      }
    }
  }

  console.log("\n" + "═".repeat(50));
  console.log("🎉 IMPORTAÇÃO CONCLUÍDA!\n");
  console.log(`📊 RESUMO:`);
  console.log(`   ✅ Importados com sucesso: ${totalImported}`);
  console.log(`   ⏭️  Pulados (duplicados/inválidos): ${totalSkipped}`);
  console.log(`   ❌ Erros: ${totalErrors}`);
  console.log("═".repeat(50));
}

main()
  .catch((e) => {
    console.error("\n❌ ERRO FATAL:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
