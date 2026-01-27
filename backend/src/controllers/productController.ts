import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Listar todos os produtos (com filtros e PAGINAÇÃO)
 */
export async function listProducts(req: Request, res: Response) {
  try {
    const {
      categoryId,
      search,
      minPrice,
      maxPrice,
      page = "1",
      limit = "20",
    } = req.query;

    // Construir filtros
    const where: any = {};

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

    // Converter page e limit para números
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Calcular skip (offset) para paginação
    const skip = (pageNum - 1) * limitNum;

    // Buscar produtos com paginação
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, description: true },
          },
        },
        skip,
        take: limitNum,
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
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
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
    const { name, description, price, stock, categoryId, imageUrl } = req.body;

    // Validações básicas
    if (!name || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios: name, price, categoryId",
      });
    }

    // Criar produto
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        categoryId,
        imageUrl,
        slug: name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        sku: `SKU-${Math.random().toString(36).toUpperCase().substring(7)}`,
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
    const { name, description, price, stock, categoryId, imageUrl } = req.body;

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

    // Montar objeto de atualização (apenas campos enviados)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

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

    // Deletar produto
    await prisma.product.delete({
      where: { id },
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
