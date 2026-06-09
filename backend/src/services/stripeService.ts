import Stripe from "stripe";

/**
 * 💳 STRIPE SERVICE
 * Integração com Stripe para pagamentos
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  // @ts-ignore
  apiVersion: "2023-10-16",
});

// ========================================
// 💳 CRIAR SESSÃO DE CHECKOUT
// ========================================
export const createCheckoutSession = async (orderData: {
  orderNumber: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
}) => {
  try {
    // Preparar items para Stripe
    const lineItems = orderData.items.map((item) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.productName,
          metadata: {
            productId: item.productId,
          },
        } as any,
        unit_amount: Math.round(item.unitPrice * 100), // Converter para centavos
      },
      quantity: item.quantity,
    }));

    // Adicionar frete como linha separada
    lineItems.push({
      price_data: {
        currency: "brl",
        product_data: {
          name: "Frete",
        },
        unit_amount: Math.round(orderData.shipping * 100),
      },
      quantity: 1,
    });

    // Criar sessão
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: orderData.customerEmail,
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/order-success/${orderData.orderNumber}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/checkout`,
      metadata: {
        orderNumber: orderData.orderNumber,
      },
    });

    console.log(`✅ Sessão Stripe criada: ${session.id}`);

    return {
      success: true,
      sessionId: session.id,
      clientSecret: session.client_secret,
    };
  } catch (error) {
    console.error("❌ Erro ao criar sessão Stripe:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// ========================================
// 🔍 BUSCAR SESSÃO DE CHECKOUT
// ========================================
export const getCheckoutSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: true,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        status: session.status,
        customerEmail: session.customer_email,
        metadata: session.metadata,
        paymentIntentId: session.payment_intent,
      },
    };
  } catch (error) {
    console.error("❌ Erro ao buscar sessão Stripe:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// ========================================
// 💰 BUSCAR PAYMENT INTENT
// ========================================
export const getPaymentIntent = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status, // succeeded, processing, requires_action, etc
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        clientSecret: paymentIntent.client_secret,
      },
    };
  } catch (error) {
    console.error("❌ Erro ao buscar payment intent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// ========================================
// 🔐 VERIFICAR WEBHOOK
// ========================================
export const verifyWebhookSignature = (
  body: string,
  signature: string,
): { success: boolean; event?: any } => {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET não configurado");
      return { success: false };
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret);

    return { success: true, event };
  } catch (error) {
    console.error("❌ Erro ao verificar webhook:", error);
    return { success: false };
  }
};

// ========================================
// ✅ PROCESSAR WEBHOOK
// ========================================
export const handleWebhookEvent = async (event: any) => {
  try {
    switch (event.type) {
      case "checkout.session.completed":
        console.log("✅ Pagamento completado:", event.data.object);
        return {
          success: true,
          action: "payment_completed",
          sessionId: event.data.object.id,
          orderNumber: event.data.object.metadata?.orderNumber,
        };

      case "payment_intent.succeeded":
        console.log("✅ Payment intent bem-sucedido:", event.data.object);
        return {
          success: true,
          action: "payment_succeeded",
          paymentIntentId: event.data.object.id,
        };

      case "payment_intent.payment_failed":
        console.log("❌ Pagamento falhou:", event.data.object);
        return {
          success: true,
          action: "payment_failed",
          paymentIntentId: event.data.object.id,
          error: event.data.object.last_payment_error?.message,
        };

      default:
        console.log("📌 Evento não tratado:", event.type);
        return { success: true, action: "unhandled_event" };
    }
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    return { success: false, error };
  }
};

// ========================================
// 💳 REEMBOLSAR PAGAMENTO
// ========================================
export const refundPayment = async (paymentIntentId: string) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    console.log(`✅ Reembolso criado: ${refund.id}`);

    return {
      success: true,
      refundId: refund.id,
      status: refund.status,
    };
  } catch (error) {
    console.error("❌ Erro ao reembolsar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};
