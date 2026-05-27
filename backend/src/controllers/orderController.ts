import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🛒 ORDER CONTROLLER
 * Gerencia pedidos (checkout)
 */

// ========================================
// 📝 CRIAR PEDIDO
// ========================================
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      // Cliente
      customerName,
      customerEmail,
      customerPhone,
      customerDocument,

      // Endereço
      zipCode,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,

      // Valores
      subtotal,
      shipping,
      discount = 0,
      total,

      // Pagamento
      paymentMethod,

      // Observações
      notes,

      // Itens do carrinho
      items, // Array: [{ productId, quantity, unitPrice, totalPrice }]
    } = req.body;

    // Validações básicas
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerDocument
    ) {
      return res.status(400).json({
        success: false,
        message: "Dados do cliente incompletos",
      });
    }

    if (!zipCode || !street || !number || !neighborhood || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "Endereço incompleto",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Carrinho vazio",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Forma de pagamento não informada",
      });
    }

    // Gerar número do pedido único (AZ-2024-00001)
    const year = new Date().getFullYear();
    const lastOrder = await prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `AZ-${year}-`,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let orderNumber = `AZ-${year}-00001`;
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNumber.split("-")[2]);
      const nextNumber = (lastNumber + 1).toString().padStart(5, "0");
      orderNumber = `AZ-${year}-${nextNumber}`;
    }

    // Buscar produtos para criar snapshot
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Validar estoque
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Produto ${item.productId} não encontrado`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para ${product.name}`,
        });
      }
    }

    // Criar pedido com itens
    const order = await prisma.order.create({
      data: {
        orderNumber,

        // Cliente (userId é opcional - compra sem login)
        userId: (req as any).user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        customerDocument,

        // Endereço
        zipCode,
        street,
        number,
        complement: complement || null,
        neighborhood,
        city,
        state,

        // Valores
        subtotal,
        shipping,
        discount,
        total,

        // Pagamento
        paymentMethod,

        // Observações
        notes: notes || null,

        // Itens
        items: {
          create: items.map((item: any) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              productName: product!.name,
              productSku: product!.sku,
              productImage: product!.imageUrl || null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Decrementar estoque
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      data: order,
      message: "Pedido criado com sucesso!",
    });
  } catch (error) {
    console.error("❌ Erro ao criar pedido:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar pedido",
    });
  }
};

// ========================================
// 📋 LISTAR TODOS OS PEDIDOS (ADMIN)
// ========================================
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro ao listar pedidos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar pedidos",
    });
  }
};

// ========================================
// 🔍 BUSCAR PEDIDO POR ID
// ========================================
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar pedido:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar pedido",
    });
  }
};

// ========================================
// 🔍 BUSCAR PEDIDO POR NÚMERO
// ========================================
export const getOrderByNumber = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Pedido não encontrado",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar pedido:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar pedido",
    });
  }
};

// ========================================
// 👤 BUSCAR PEDIDOS DO USUÁRIO
// ========================================
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar pedidos do usuário:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos",
    });
  }
};

// ========================================
// 🔄 ATUALIZAR STATUS DO PEDIDO (ADMIN)
// ========================================
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, trackingCode } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status é obrigatório",
      });
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    // Atualizar datas específicas baseado no status
    if (status === "PAID" && !updateData.paidAt) {
      updateData.paidAt = new Date();
    }
    if (status === "SHIPPED") {
      updateData.shippedAt = new Date();
      if (trackingCode) {
        updateData.trackingCode = trackingCode;
      }
    }
    if (status === "DELIVERED") {
      updateData.deliveredAt = new Date();
    }
    if (status === "CANCELLED") {
      updateData.cancelledAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
      },
    });

    res.json({
      success: true,
      data: order,
      message: "Status atualizado com sucesso!",
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar status:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar status",
    });
  }
};
