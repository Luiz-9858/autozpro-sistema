import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Função auxiliar para gerar slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

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
      isActive = "true", // Mostrar apenas produtos ativos por padrão
    } = req.query;

    // Construir filtros
    const where: any = {};

    // Filtrar apenas produtos ativos (a menos que seja especificado o contrário)
    if (isActive === "true") {
      where.isActive = true;
    }

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
            select: { id: true, name: true, description: true },
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
 * Obter um produto por ID ou SLUG
 */
export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Tentar buscar por ID ou por slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
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
    const {
      name,
      description,
      price,
      salePrice,
      stock,
      sku,
      categoryId,
      imageUrl,
    } = req.body;

    // Validações básicas
    if (!name || !price || !sku || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios: name, price, sku, categoryId",
      });
    }

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

    // Gerar slug automaticamente
    const slug = generateSlug(name);

    // Verificar se slug já existe (adicionar número se necessário)
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Criar produto
    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        stock: stock ? parseInt(stock) : 0,
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
    const {
      name,
      description,
      price,
      salePrice,
      stock,
      sku,
      categoryId,
      imageUrl,
      isActive,
    } = req.body;

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

    // Se está alterando o SKU, verificar se já existe
    if (sku && sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku },
      });

      if (existingSku) {
        return res.status(400).json({
          success: false,
          message: "SKU já cadastrado em outro produto",
        });
      }
    }

    // Montar objeto de atualização
    const updateData: any = {};
    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (salePrice !== undefined)
      updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (sku !== undefined) updateData.sku = sku;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;

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
 * Deletar produto (ADMIN) - Soft delete
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

    // Soft delete (apenas desativa)
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      success: true,
      message: "Produto desativado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao deletar produto",
    });
  }
}
