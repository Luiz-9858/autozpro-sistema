import { Request, Response } from "express";
import prisma from "../config/prisma";

// ========================================
// 📝 INTERFACES E TIPOS
// ========================================

interface PaginationQuery {
  page?: string;
  limit?: string;
}

interface ProductCreateData {
  name: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}

// ========================================
// 🔍 GET ALL PRODUCTS (COM PAGINAÇÃO)
// ========================================

export const getProducts = async (
  req: Request<{}, {}, {}, PaginationQuery>,
  res: Response,
): Promise<void> => {
  try {
    // 1️⃣ Pegar parâmetros de paginação da query string
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 20;
    const skip: number = (page - 1) * limit;

    console.log(`📄 Buscando produtos - Página ${page}, Limite ${limit}`);

    // 2️⃣ Buscar produtos com paginação
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
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
      prisma.product.count(),
    ]);

    // 3️⃣ Calcular total de páginas
    const totalPages: number = Math.ceil(totalProducts / limit);

    console.log(
      `✅ Encontrados ${products.length} produtos de ${totalProducts} totais`,
    );

    // 4️⃣ Retornar resposta COM metadados de paginação
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
      slug,
      sku,
      description,
      price,
      salePrice,
      stock,
      imageUrl,
      categoryId,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
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
      data: product,
    });
  } catch (error) {
    console.error("❌ Erro ao criar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar produto",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// ✏️ UPDATE PRODUCT
// ========================================

export const updateProduct = async (
  req: Request<{ id: string }, {}, Partial<ProductCreateData>>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar produto",
      error: error instanceof Error ? error.message : "Erro desconhecido",
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
