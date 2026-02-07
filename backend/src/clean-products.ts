/**
 * 🧹 SCRIPT DE LIMPEZA DE DADOS DOS PRODUTOS
 *
 * O QUE ESTE SCRIPT FAZ:
 * 1. Remove HTML dos nomes e descrições
 * 2. Decodifica caracteres especiais (\u003C = <, \u003E = >)
 * 3. Desativa produtos com preço = 0
 * 4. Desativa produtos com estoque = 0
 * 5. Padroniza nomes (capitalização correta)
 *
 * COMO RODAR:
 * npx tsx src/clean-products.ts
 */

import prisma from "./config/prisma";
import dotenv from "dotenv";

dotenv.config();

// ========================================
// 🧹 FUNÇÕES DE LIMPEZA
// ========================================

/**
 * Remove todas as tags HTML de uma string
 * Exemplo: "<p class='x'>Texto</p>" → "Texto"
 */
function removeHtml(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]*>/g, "").trim();
}

/**
 * Decodifica caracteres Unicode escapados
 * Exemplo: "\u003Cp\u003E" → "<p>"
 * Depois remove o HTML resultante
 */
function decodeAndClean(text: string): string {
  if (!text) return "";

  // 1. Decodifica unicode escapado
  let cleaned = text.replace(/\\u([0-9A-Fa-f]{4})/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });

  // 2. Remove HTML
  cleaned = removeHtml(cleaned);

  // 3. Remove quebras de linha extras
  cleaned = cleaned.replace(/\n\s*\n/g, "\n").trim();

  // 4. Remove espaços duplos
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Capitaliza a primeira letra de cada palavra importante
 * Exemplo: "ALTERNADOR PULSE FASTBACK" → "Alternador Pulse Fastback"
 */
function capitalizeWords(text: string): string {
  if (!text) return "";

  // Palavras que devem permanecer em maiúsculas
  const keepUpperCase = [
    "VW",
    "BMW",
    "GM",
    "FIAT",
    "JEEP",
    "SKF",
    "OEM",
    "GE",
    "ZM",
  ];

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => {
      // Mantém certas palavras em maiúsculas
      if (keepUpperCase.includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      // Capitaliza a primeira letra
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// ========================================
// 📊 RELATÓRIO DE LIMPEZA
// ========================================

interface CleanupReport {
  total: number;
  namesFixed: number;
  descriptionsFixed: number;
  deactivatedByPrice: number;
  deactivatedByStock: number;
  alreadyClean: number;
}

// ========================================
// 🚀 MAIN - EXECUTA A LIMPEZA
// ========================================

async function cleanProducts() {
  console.log("🧹 Iniciando limpeza de produtos...\n");

  const report: CleanupReport = {
    total: 0,
    namesFixed: 0,
    descriptionsFixed: 0,
    deactivatedByPrice: 0,
    deactivatedByStock: 0,
    alreadyClean: 0,
  };

  try {
    // 1️⃣ Buscar todos os produtos
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        isActive: true,
      },
    });

    report.total = products.length;
    console.log(`📦 Total de produtos encontrados: ${products.length}\n`);

    // 2️⃣ Processar cada produto
    for (const product of products) {
      let needsUpdate = false;
      const updateData: any = {};

      // --- Limpar Nome ---
      const cleanedName = capitalizeWords(decodeAndClean(product.name));
      if (cleanedName !== product.name) {
        updateData.name = cleanedName;
        needsUpdate = true;
        report.namesFixed++;
      }

      // --- Limpar Descrição ---
      if (product.description) {
        const cleanedDescription = decodeAndClean(product.description);
        if (cleanedDescription !== product.description) {
          updateData.description = cleanedDescription || null;
          needsUpdate = true;
          report.descriptionsFixed++;
        }
      }

      // --- Desativar se preço = 0 ---
      if (product.price === 0 && product.isActive) {
        updateData.isActive = false;
        needsUpdate = true;
        report.deactivatedByPrice++;
      }

      // --- Desativar se estoque = 0 ---
      if (product.stock === 0 && product.isActive) {
        updateData.isActive = false;
        needsUpdate = true;
        report.deactivatedByStock++;
      }

      // --- Atualizar no banco ---
      if (needsUpdate) {
        await prisma.product.update({
          where: { id: product.id },
          data: updateData,
        });
      } else {
        report.alreadyClean++;
      }
    }

    // 3️⃣ Imprimir relatório
    console.log("========================================");
    console.log("📊 RELATÓRIO DE LIMPEZA");
    console.log("========================================");
    console.log(`📦 Total de produtos:           ${report.total}`);
    console.log(`✏️  Nomes corrigidos:            ${report.namesFixed}`);
    console.log(`📝 Descrições corrigidas:       ${report.descriptionsFixed}`);
    console.log(`💰 Desativados (preço = 0):     ${report.deactivatedByPrice}`);
    console.log(`📦 Desativados (estoque = 0):   ${report.deactivatedByStock}`);
    console.log(`✅ Já estavam limpos:            ${report.alreadyClean}`);
    console.log("========================================\n");

    console.log("✅ Limpeza concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a limpeza:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
cleanProducts();
