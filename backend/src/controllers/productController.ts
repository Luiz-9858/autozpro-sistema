import { Request, Response } from "express";
import prisma from "../config/prisma";

// ========================================
// 📝 INTERFACES E TIPOS
// ========================================

interface PaginationQuery {
  page?: string;
  limit?: string;
  categoryId?: string; // ✅ NOVO: Filtro por categoria
  search?: string; // ✅ NOVO: Busca por nome
}

interface ProductCreateData {
  name: string;
  sku: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}

interface ProductUpdateData {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  salePrice?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
  isActive?: boolean;
}

// ========================================
// 🔍 GET ALL PRODUCTS (COM PAGINAÇÃO E FILTROS)
// ========================================

export const getProducts = async (
  req: Request<{}, {}, {}, PaginationQuery>,
  res: Response,
): Promise<void> => {
  try {
    // 1️⃣ Pegar parâmetros da query string
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 20;
    const skip: number = (page - 1) * limit;
    const categoryId = req.query.categoryId;
    const search = req.query.search;

    console.log(`📄 Buscando produtos - Página ${page}, Limite ${limit}`);
    if (categoryId) console.log(`🏷️  Filtro: Categoria ${categoryId}`);
    if (search) console.log(`🔍 Busca: "${search}"`);

    // 2️⃣ Montar filtros dinâmicos
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    // 3️⃣ Buscar produtos com filtros
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    // 4️⃣ Calcular total de páginas
    const totalPages: number = Math.ceil(totalProducts / limit);

    console.log(
      `✅ Encontrados ${products.length} produtos de ${totalProducts} totais`,
    );

    // 5️⃣ Retornar resposta COM metadados de paginação
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters: {
          categoryId: categoryId || null,
          search: search || null,
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar produtos",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// 🔍 GET PRODUCT BY ID
// ========================================

export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
      },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar produto",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// ➕ CREATE PRODUCT
// ========================================
export const createProduct = async (
  req: Request<{}, {}, ProductCreateData>,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      sku,
      description,
      price,
      salePrice,
      stock,
      imageUrl,
      categoryId,
    } = req.body;

    // 🔧 Gerar slug automaticamente a partir do nome
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
      .replace(/\s+/g, "-") // Substitui espaços por hífens
      .replace(/-+/g, "-") // Remove hífens duplicados
      .trim();

    const product = await prisma.product.create({
      data: {
        name,
        slug, // ← Slug gerado automaticamente
        sku,
        description: description || null,
        price,
        salePrice: salePrice || null,
        stock,
        imageUrl: imageUrl || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Produto criado com sucesso",
      data: product,
    });
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar produto",
    });
  }
};

// ========================================
// ✏️ UPDATE PRODUCT
// ========================================

export const updateProduct = async (
  req: Request<{ id: string }, {}, ProductUpdateData>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      sku,
      description,
      price,
      salePrice,
      stock,
      imageUrl,
      categoryId,
      isActive,
    } = req.body;

    // 🔧 Gerar slug automaticamente se o nome foi fornecido
    const slug = name
      ? name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
      : undefined;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug, // ← Slug gerado automaticamente
        sku,
        description: description || null,
        price,
        salePrice: salePrice || null,
        stock,
        imageUrl: imageUrl || null,
        categoryId,
        isActive,
      },
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: product,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar produto",
    });
  }
};

// ========================================
// ❌ DELETE PRODUCT
// ========================================

export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Produto deletado com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao deletar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar produto",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
