import { Request, Response } from "express";
import prisma from "../config/prisma";

// ========================================
// 📝 INTERFACES E TIPOS
// ========================================

interface PaginationQuery {
  page?: string;
  limit?: string;
  categoryId?: string;
  search?: string;
  vehicleId?: string; // ✅ Filtro por veículo
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
  vehicleIds?: string[]; // ✅ Associar veículos na criação
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
  vehicleIds?: string[]; // ✅ Associar veículos na atualização
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
    const vehicleId = req.query.vehicleId; // ✅ Filtro por veículo

    console.log(`📄 Buscando produtos - Página ${page}, Limite ${limit}`);
    if (categoryId) console.log(`🏷️  Filtro: Categoria ${categoryId}`);
    if (search) console.log(`🔍 Busca: "${search}"`);
    if (vehicleId) console.log(`🚗 Filtro: Veículo ${vehicleId}`);

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

    // ✅ Filtro por veículo (via tabela de relacionamento)
    if (vehicleId) {
      where.vehicles = {
        some: {
          vehicleId: vehicleId,
        },
      };
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
          // ✅ Incluir veículos compatíveis (condicional)
          vehicles: vehicleId
            ? {
                where: { vehicleId: vehicleId },
                include: {
                  vehicle: true, // ✅ CORRIGIDO: Include completo sem select aninhado
                },
              }
            : true, // ✅ CORRIGIDO: true ao invés de false
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
          vehicleId: vehicleId || null,
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
        // ✅ Incluir todos os veículos compatíveis
        vehicles: {
          include: {
            vehicle: true, // ✅ CORRIGIDO: Include completo
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
      vehicleIds,
    } = req.body;

    // 🔧 Gerar slug automaticamente a partir do nome
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

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
        // ✅ Associar veículos ao criar
        ...(vehicleIds && vehicleIds.length > 0
          ? {
              vehicles: {
                create: vehicleIds.map((vehicleId) => ({ vehicleId })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        vehicles: {
          include: {
            vehicle: true, // ✅ CORRIGIDO: Include completo
          },
        },
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
      vehicleIds,
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
        slug,
        sku,
        description: description || null,
        price,
        salePrice: salePrice || null,
        stock,
        imageUrl: imageUrl || null,
        categoryId,
        isActive,
        // ✅ Substituir veículos associados (deleteMany + create)
        ...(vehicleIds !== undefined
          ? {
              vehicles: {
                deleteMany: {},
                create: vehicleIds.map((vehicleId) => ({ vehicleId })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        vehicles: {
          include: {
            vehicle: true, // ✅ CORRIGIDO: Include completo
          },
        },
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
