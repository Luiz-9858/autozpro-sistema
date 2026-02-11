import { Request, Response } from "express";
import prisma from "../config/prisma";

// ========================================
// 📊 GET DASHBOARD STATISTICS
// ========================================

/**
 * 🎯 FUNÇÃO: Buscar estatísticas gerais do e-commerce
 * 📤 RETORNA: Total de produtos, categorias, estoque total, produtos inativos
 * 🔒 PERMISSÃO: Apenas admin
 */
export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1️⃣ Buscar estatísticas em paralelo (mais rápido)
    const [
      totalProducts,
      totalCategories,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      totalStockValue,
      productsByCategory,
    ] = await Promise.all([
      // Total de produtos
      prisma.product.count(),

      // Total de categorias
      prisma.category.count(),

      // Produtos ativos
      prisma.product.count({
        where: { isActive: true },
      }),

      // Produtos inativos
      prisma.product.count({
        where: { isActive: false },
      }),

      // Produtos com estoque baixo (menos de 5 unidades)
      prisma.product.count({
        where: {
          stock: { lt: 5 },
          isActive: true,
        },
      }),

      // Valor total do estoque
      prisma.product.aggregate({
        _sum: {
          stock: true,
        },
      }),

      // Produtos agrupados por categoria
      prisma.product.groupBy({
        by: ["categoryId"],
        _count: {
          id: true,
        },
      }),
    ]);

    // 2️⃣ Buscar nomes das categorias
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // 3️⃣ Montar mapa de categorias
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    // 4️⃣ Formatar dados de produtos por categoria
    const productsByCategoryFormatted = productsByCategory.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId) || "Desconhecida",
      count: item._count.id,
    }));

    // 5️⃣ Buscar produtos com estoque baixo (detalhes)
    const lowStockProductsList = await prisma.product.findMany({
      where: {
        stock: { lt: 5 },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 10,
      orderBy: {
        stock: "asc",
      },
    });

    // 6️⃣ Retornar estatísticas
    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalCategories,
          activeProducts,
          inactiveProducts,
          lowStockProducts,
          totalStock: totalStockValue._sum.stock || 0,
        },
        productsByCategory: productsByCategoryFormatted,
        lowStockProducts: lowStockProductsList,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar estatísticas do dashboard",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// 📦 GET PRODUCTS WITH LOW STOCK
// ========================================

/**
 * 🎯 FUNÇÃO: Buscar produtos com estoque baixo
 * 📤 RETORNA: Lista de produtos com menos de 5 unidades
 * 🔒 PERMISSÃO: Apenas admin
 */
export const getLowStockProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: { lt: 5 },
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        stock: "asc",
      },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produtos com estoque baixo:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar produtos com estoque baixo",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
