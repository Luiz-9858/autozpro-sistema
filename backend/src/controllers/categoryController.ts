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
            products: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

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

// ========================================
// ➕ CREATE CATEGORY
// ========================================

interface CategoryCreateData {
  name: string;
  slug: string;
  description?: string;
}

/**
 * 🎯 FUNÇÃO: Criar nova categoria
 * 📥 RECEBE: name, slug, description (opcional)
 * 📤 RETORNA: Categoria criada
 * ⚠️  VALIDAÇÕES: Nome obrigatório, slug único
 * 🔒 PERMISSÃO: Apenas admin
 */
export const createCategory = async (
  req: Request<{}, {}, CategoryCreateData>,
  res: Response,
): Promise<void> => {
  try {
    const { name, slug, description } = req.body;

    // 1️⃣ Validações
    if (!name || name.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Nome da categoria é obrigatório",
      });
      return;
    }

    if (!slug || slug.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Slug da categoria é obrigatório",
      });
      return;
    }

    // 2️⃣ Verificar se slug já existe
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: "Já existe uma categoria com este slug",
      });
      return;
    }

    // 3️⃣ Criar categoria
    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description?.trim() || null,
      },
    });

    console.log(`✅ Categoria criada: ${category.name} (${category.id})`);

    res.status(201).json({
      success: true,
      data: category,
      message: "Categoria criada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao criar categoria:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar categoria",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// ✏️ UPDATE CATEGORY
// ========================================

/**
 * 🎯 FUNÇÃO: Atualizar categoria existente
 * 📥 RECEBE: ID da categoria + dados atualizados
 * 📤 RETORNA: Categoria atualizada
 * ⚠️  VALIDAÇÕES: Categoria deve existir, slug único
 * 🔒 PERMISSÃO: Apenas admin
 */
export const updateCategory = async (
  req: Request<{ id: string }, {}, Partial<CategoryCreateData>>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    // 1️⃣ Verificar se categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
      return;
    }

    // 2️⃣ Se está mudando o slug, verificar se não existe outro com mesmo slug
    if (slug && slug !== existingCategory.slug) {
      const categoryWithSlug = await prisma.category.findUnique({
        where: { slug: slug.trim().toLowerCase() },
      });

      if (categoryWithSlug) {
        res.status(409).json({
          success: false,
          message: "Já existe uma categoria com este slug",
        });
        return;
      }
    }

    // 3️⃣ Atualizar categoria
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(slug && { slug: slug.trim().toLowerCase() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
      },
    });

    console.log(`✅ Categoria atualizada: ${category.name} (${category.id})`);

    res.json({
      success: true,
      data: category,
      message: "Categoria atualizada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar categoria:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar categoria",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// ❌ DELETE CATEGORY
// ========================================

/**
 * 🎯 FUNÇÃO: Deletar categoria
 * 📥 RECEBE: ID da categoria
 * 📤 RETORNA: Confirmação de exclusão
 * ⚠️  VALIDAÇÕES: Categoria não pode ter produtos associados
 * 🔒 PERMISSÃO: Apenas admin
 */
export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // 1️⃣ Verificar se categoria existe
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

    // 2️⃣ Verificar se tem produtos associados
    if (category._count.products > 0) {
      res.status(409).json({
        success: false,
        message: `Não é possível deletar esta categoria pois existem ${category._count.products} produtos associados a ela`,
      });
      return;
    }

    // 3️⃣ Deletar categoria
    await prisma.category.delete({
      where: { id },
    });

    console.log(`✅ Categoria deletada: ${category.name} (${id})`);

    res.json({
      success: true,
      message: "Categoria deletada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao deletar categoria:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar categoria",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
