/**
 * 🏷️ SCRIPT DE RECLASSIFICAÇÃO AUTOMÁTICA DE PRODUTOS
 *
 * O QUE ESTE SCRIPT FAZ:
 * 1. Busca produtos da categoria "Outros"
 * 2. Analisa o nome do produto
 * 3. Reclassifica baseado em palavras-chave
 * 4. Gera relatório detalhado
 *
 * COMO RODAR:
 * npx tsx src/reclassify-products.ts
 */

import prisma from "./config/prisma";
import dotenv from "dotenv";

dotenv.config();

// ========================================
// 🎯 PALAVRAS-CHAVE POR CATEGORIA
// ========================================

const CATEGORY_KEYWORDS = {
  motor: [
    "motor",
    "alternador",
    "vela",
    "bobina",
    "correia",
    "corrente",
    "polia",
    "tensor",
    "bomba dagua",
    "bomba d'agua",
    "junta",
    "retentor",
    "pistao",
    "pistão",
    "biela",
    "válvula",
    "valvula",
    "cabeçote",
    "cabecote",
    "cárter",
    "carter",
    "comando",
  ],
  freios: [
    "freio",
    "pastilha",
    "disco",
    "tambor",
    "lona",
    "cilindro",
    "mestre",
    "servo",
    "pinça",
    "pinca",
    "sapata",
  ],
  suspensao: [
    "suspensao",
    "suspensão",
    "amortecedor",
    "mola",
    "barra",
    "estabilizadora",
    "bandeja",
    "braço",
    "braco",
    "pivô",
    "pivo",
    "terminal",
    "axial",
    "rotula",
    "rótula",
    "bucha",
    "coxim",
  ],
  filtros: [
    "filtro",
    "ar",
    "oleo",
    "óleo",
    "combustivel",
    "combustível",
    "cabine",
    "polen",
    "pólen",
  ],
  eletrica: [
    "bateria",
    "lampada",
    "lâmpada",
    "farol",
    "lanterna",
    "soquete",
    "sensor",
    "interruptor",
    "rele",
    "relé",
    "fusivel",
    "fusível",
    "chicote",
    "cabo",
    "vela",
    "ignição",
    "ignicao",
    "modulo",
    "módulo",
  ],
  "oleo-e-fluidos": [
    "oleo",
    "óleo",
    "lubrificante",
    "fluido",
    "liquido",
    "líquido",
    "arrefecimento",
    "hidráulico",
    "hidraulico",
    "aditivo",
    "desengraxante",
  ],
};

// ========================================
// 🔍 FUNÇÃO DE CLASSIFICAÇÃO
// ========================================

function classifyProduct(productName: string): string | null {
  if (!productName) return null;

  const nameLower = productName.toLowerCase();

  // Verifica cada categoria
  for (const [categorySlug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        return categorySlug;
      }
    }
  }

  return null; // Não encontrou categoria
}

// ========================================
// 📊 RELATÓRIO DE RECLASSIFICAÇÃO
// ========================================

interface ReclassifyReport {
  total: number;
  reclassified: number;
  noMatch: number;
  noName: number;
  byCategory: Record<string, number>;
}

// ========================================
// 🚀 MAIN - EXECUTA A RECLASSIFICAÇÃO
// ========================================

async function reclassifyProducts() {
  console.log("🏷️  Iniciando reclassificação de produtos...\n");

  const report: ReclassifyReport = {
    total: 0,
    reclassified: 0,
    noMatch: 0,
    noName: 0,
    byCategory: {},
  };

  try {
    // 1️⃣ Buscar categoria "Outros"
    const outrosCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: "outros" },
          { name: { contains: "Outros", mode: "insensitive" } },
        ],
      },
    });

    if (!outrosCategory) {
      console.log('❌ Categoria "Outros" não encontrada!');
      return;
    }

    console.log(
      `📂 Categoria "Outros" encontrada: ${outrosCategory.name} (${outrosCategory.id})\n`,
    );

    // 2️⃣ Buscar todos os produtos da categoria "Outros"
    const products = await prisma.product.findMany({
      where: {
        categoryId: outrosCategory.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    report.total = products.length;
    console.log(`📦 Total de produtos em "Outros": ${products.length}\n`);

    if (products.length === 0) {
      console.log("✅ Não há produtos para reclassificar!");
      return;
    }

    // 3️⃣ Buscar todas as categorias disponíveis
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    const categoryMap = new Map<string, { id: string; name: string }>();
    categories.forEach((cat) => {
      categoryMap.set(cat.slug, { id: cat.id, name: cat.name });
    });

    console.log("🔄 Processando produtos...\n");

    // 4️⃣ Processar cada produto
    for (const product of products) {
      // Verificar se tem nome
      if (!product.name || product.name.trim() === "") {
        report.noName++;
        continue;
      }

      // Classificar
      const categorySlug = classifyProduct(product.name);

      if (!categorySlug) {
        report.noMatch++;
        continue;
      }

      // Buscar categoria correspondente
      const newCategory = categoryMap.get(categorySlug);

      if (!newCategory) {
        report.noMatch++;
        continue;
      }

      // Atualizar produto
      await prisma.product.update({
        where: { id: product.id },
        data: { categoryId: newCategory.id },
      });

      report.reclassified++;
      report.byCategory[newCategory.name] =
        (report.byCategory[newCategory.name] || 0) + 1;

      // Log a cada 50 produtos
      if (report.reclassified % 50 === 0) {
        console.log(`✅ ${report.reclassified} produtos reclassificados...`);
      }
    }

    // 5️⃣ Imprimir relatório
    console.log("\n========================================");
    console.log("📊 RELATÓRIO DE RECLASSIFICAÇÃO");
    console.log("========================================");
    console.log(`📦 Total de produtos processados:  ${report.total}`);
    console.log(`✅ Reclassificados com sucesso:    ${report.reclassified}`);
    console.log(`❌ Sem correspondência:            ${report.noMatch}`);
    console.log(`⚠️  Sem nome (precisam revisão):   ${report.noName}`);
    console.log("========================================");
    console.log("📂 PRODUTOS POR CATEGORIA:");
    console.log("========================================");

    Object.entries(report.byCategory)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   ${category.padEnd(20)} ${count}`);
      });

    console.log("========================================\n");

    if (report.noName > 0) {
      console.log(
        `⚠️  ATENÇÃO: ${report.noName} produtos sem nome foram deixados em "Outros".`,
      );
      console.log(
        "   Considere desativá-los ou adicionar nomes manualmente.\n",
      );
    }

    if (report.noMatch > 0) {
      console.log(
        `ℹ️  INFO: ${report.noMatch} produtos não corresponderam a nenhuma categoria.`,
      );
      console.log('   Eles permanecem em "Outros".\n');
    }

    console.log("✅ Reclassificação concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a reclassificação:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
reclassifyProducts();
