import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 📸 CONTROLLER: Atualização em Massa de Imagens
 *
 * Recebe array de { sku, imageUrl } e atualiza produtos.
 */

interface BulkImageUpdate {
  sku: string;
  imageUrl: string;
}

interface UpdateResult {
  sku: string;
  status: "success" | "error" | "not_found";
  message: string;
}

export const bulkUpdateImages = async (req: Request, res: Response) => {
  try {
    const updates: BulkImageUpdate[] = req.body.updates;

    // Validação
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Envie um array de atualizações no formato: [{ sku, imageUrl }]",
      });
    }

    // Validar formato de cada item
    for (const item of updates) {
      if (!item.sku || typeof item.sku !== "string") {
        return res.status(400).json({
          success: false,
          message: "Cada item deve ter um SKU válido (string)",
        });
      }

      if (!item.imageUrl || typeof item.imageUrl !== "string") {
        return res.status(400).json({
          success: false,
          message: "Cada item deve ter uma imageUrl válida (string)",
        });
      }

      // Validar URL básica
      if (!item.imageUrl.startsWith("http")) {
        return res.status(400).json({
          success: false,
          message: `URL inválida para SKU ${item.sku}: deve começar com http ou https`,
        });
      }
    }

    // Processar atualizações
    const results: UpdateResult[] = [];
    let successCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;

    for (const { sku, imageUrl } of updates) {
      try {
        // Buscar produto pelo SKU
        const product = await prisma.product.findUnique({
          where: { sku },
        });

        if (!product) {
          results.push({
            sku,
            status: "not_found",
            message: `Produto com SKU ${sku} não encontrado`,
          });
          notFoundCount++;
          continue;
        }

        // Atualizar imagem
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl },
        });

        results.push({
          sku,
          status: "success",
          message: `Imagem atualizada com sucesso`,
        });
        successCount++;
      } catch (error) {
        console.error(`Erro ao atualizar SKU ${sku}:`, error);
        results.push({
          sku,
          status: "error",
          message: `Erro ao atualizar: ${error}`,
        });
        errorCount++;
      }
    }

    // Retornar relatório
    return res.json({
      success: true,
      summary: {
        total: updates.length,
        success: successCount,
        notFound: notFoundCount,
        errors: errorCount,
      },
      results,
    });
  } catch (error) {
    console.error("❌ Erro na atualização em massa:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao processar atualização em massa",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

/**
 * 📥 Exportar produtos sem imagem (para criar CSV)
 */
export const getProductsWithoutImages = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [{ imageUrl: null }, { imageUrl: "" }],
      },
      select: {
        sku: true,
        name: true,
      },
      orderBy: {
        sku: "asc",
      },
    });

    return res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produtos sem imagem:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar produtos sem imagem",
    });
  }
};
