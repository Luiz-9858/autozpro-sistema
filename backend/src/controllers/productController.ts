import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Listar todos os produtos (com filtros)
 */
export async function listProducts(req: Request, res: Response) {
  try {
    const {
      categoryId,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    // Construir filtros
    const where: any = {
      isActive: true,
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    // Paginação
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Buscar produtos
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar produtos",
    });
  }
}

/**
 * Obter um produto por ID
 */
export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        compatibilities: {
          include: {
            vehicle: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar produto",
    });
  }
}

/**
 * Criar novo produto (ADMIN)
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      stock,
      sku,
      categoryId,
      imageUrl,
    } = req.body;

    // Verificar se SKU já existe
    const existingSku = await prisma.product.findUnique({
      where: { sku },
    });

    if (existingSku) {
      return res.status(400).json({
        success: false,
        message: "SKU já cadastrado",
      });
    }

    // Criar produto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        salePrice,
        stock,
        sku,
        categoryId,
        imageUrl,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Produto criado com sucesso",
      data: { product },
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar produto",
    });
  }
}

/**
 * Atualizar produto (ADMIN)
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar se produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    // Atualizar
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: { product },
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar produto",
    });
  }
}

/**
 * Deletar produto (ADMIN)
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Soft delete (apenas desativa)
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: "Produto removido com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar produto",
    });
  }
}
