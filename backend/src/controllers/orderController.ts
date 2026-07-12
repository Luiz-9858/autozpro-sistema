import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import {
  sendOrderConfirmationEmail,
  sendPaymentConfirmedEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
} from "../services/emailService";
import {
  createCheckoutSession,
  getCheckoutSession,
} from "../services/stripeService";

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
    console.log("🔍 [createOrder] Iniciando...");
    console.log("   req.user:", (req as any).user);

    const userId = (req as any).user?.id;

    console.log("   userId extraído:", userId);

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

    // Decrementar estoque automaticamente -- DECREMENTO AUTOMÁTICO FUNCIONANDO! (1/06/2026)
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

    // 📧 Enviar email de confirmação
    await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        totalPrice: Number(item.totalPrice),
      })),
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      total: Number(order.total),
      street: order.street,
      number: order.number,
      city: order.city,
      state: order.state,
    });

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

// 📖 BUSCAR MEUS PEDIDOS (usuário logado)
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    console.log("🔍 [getMyOrders] Iniciando busca...");
    console.log("   req.user:", (req as any).user);

    const userId = (req as any).user?.id; // Vem do middleware de autenticação

    console.log("   userId extraído:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    console.log(`📖 Buscando pedidos do usuário: ${userId}`);

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`✅ ${orders.length} pedidos encontrados`);

    res.json({
      success: true,
      data: orders,
      message: "Pedidos encontrados com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao buscar pedidos:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar pedidos",
      error: error instanceof Error ? error.message : "Desconhecido",
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

    // 📧 Enviar email baseado no novo status
    if (status === "PAID") {
      await sendPaymentConfirmedEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: Number(order.total),
      });
    }

    if (status === "SHIPPED") {
      await sendOrderShippedEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        trackingCode: order.trackingCode || undefined,
      });
    }

    if (status === "DELIVERED") {
      await sendOrderDeliveredEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
      });
    }

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

// ========================================
// 💳 CRIAR SESSÃO STRIPE CHECKOUT
// ========================================
export const createStripeCheckout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const {
      customerName,
      customerEmail,
      customerPhone,
      customerDocument,
      zipCode,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      items,
      subtotal,
      shipping,
      total,
    } = req.body;

    // Validação básica
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Carrinho vazio!",
      });
    }

    if (!customerEmail || !customerName) {
      return res.status(400).json({
        success: false,
        message: "Email e nome são obrigatórios!",
      });
    }

    // Validar estoque
    const prisma = new PrismaClient();

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produto ${item.productId} não encontrado`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`,
        });
      }
    }

    // Gerar número do pedido
    const lastOrder = await prisma.order.findFirst({
      orderBy: { createdAt: "desc" },
      where: {
        orderNumber: {
          startsWith: `AZ-${new Date().getFullYear()}-`,
        },
      },
    });

    const lastNumber = lastOrder
      ? parseInt(lastOrder.orderNumber.split("-")[2])
      : 0;
    const orderNumber = `AZ-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(5, "0")}`;

    // Criar pedido com status PENDING
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: (req as any).user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        customerDocument,
        zipCode,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        subtotal: new Prisma.Decimal(subtotal),
        shipping: new Prisma.Decimal(shipping),
        total: new Prisma.Decimal(total),
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            productImage: item.productImage,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            totalPrice: new Prisma.Decimal(item.totalPrice),
          })),
        },
      },
      include: { items: true },
    });

    // Criar sessão Stripe
    const stripeSession = await createCheckoutSession({
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      items: items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
      subtotal: Number(subtotal),
      shipping: Number(shipping),
      total: Number(total),
    });

    if (!stripeSession.success) {
      // Se falhar, deletar pedido
      await prisma.order.delete({
        where: { id: order.id },
      });

      return res.status(400).json({
        success: false,
        message: "Erro ao criar sessão de pagamento",
      });
    }

    // 📧 Enviar email de confirmação
    await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        totalPrice: Number(item.totalPrice),
      })),
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      total: Number(order.total),
      street: order.street,
      number: order.number,
      city: order.city,
      state: order.state,
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        sessionId: stripeSession.sessionId,
        clientSecret: stripeSession.clientSecret,
        url: stripeSession.url,
      },
      message: "Pedido criado! Redirecionando para pagamento...",
    });
  } catch (error) {
    console.error("❌ Erro ao criar checkout Stripe:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

// ========================================
// 🪝 WEBHOOK DO STRIPE
// ========================================
export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const { event } = req.body;

    console.log("🪝 Webhook recebido:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderNumber = session.metadata?.orderNumber;

      if (!orderNumber) {
        console.error("❌ orderNumber não encontrado no metadata");
        return res.status(400).json({ success: false });
      }

      // Buscar e atualizar pedido
      const prisma = new PrismaClient();

      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: { items: true },
      });

      if (!order) {
        console.error(`❌ Pedido ${orderNumber} não encontrado`);
        return res.status(404).json({ success: false });
      }

      // Atualizar status para PAID
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paymentMethod: "CREDIT_CARD",
          paymentId: session.payment_intent,
          paidAt: new Date(),
        },
        include: { items: true },
      });

      console.log(`✅ Pedido ${orderNumber} marcado como PAID`);

      // 📧 Enviar email de pagamento confirmado
      await sendPaymentConfirmedEmail({
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        total: Number(updatedOrder.total),
      });

      return res.json({ success: true, message: "Webhook processado" });
    }

    res.json({ success: true, message: "Evento não processado" });
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    res.status(500).json({ success: false, error });
  }
};
