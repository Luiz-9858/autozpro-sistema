import { PrismaClient } from "@prisma/client";

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
    .trim();
}

// Função para gerar SKU a partir do nome
function generateSku(name: string, index: number): string {
  const prefix = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 3);

  return `${prefix}-${String(index).padStart(4, "0")}`;
}

async function main() {
  console.log("🔄 Atualizando produtos existentes...");

  // Buscar todos os produtos
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
  });

  console.log(`📦 Encontrados ${products.length} produtos`);

  // Atualizar cada produto
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const slug = generateSlug(product.name);
    const sku = generateSku(product.name, i + 1);

    await prisma.product.update({
      where: { id: product.id },
      data: {
        slug,
        sku,
        isActive: true,
        salePrice: null, // Sem promoção por padrão
      },
    });

    console.log(`✅ ${i + 1}/${products.length} - ${product.name}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   SKU: ${sku}`);
  }

  console.log("\n🎉 Atualização concluída!");
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
