import { Request, Response } from "express";
import prisma from "../config/prisma";

// ========================================
// 📂 GET ALL CATEGORIES
// ========================================

export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: {
          select: {
            products: true, // Conta quantos produtos cada categoria tem
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Formatar resposta com contagem de produtos
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      productCount: category._count.products,
    }));

    res.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar categorias",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// 📂 GET CATEGORY BY ID
// ========================================

export const getCategoryById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        productCount: category._count.products,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar categoria:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar categoria",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// 📂 GET CATEGORY BY SLUG
// ========================================

export const getCategoryBySlug = async (
  req: Request<{ slug: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        productCount: category._count.products,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar categoria:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar categoria",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
