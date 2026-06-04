import nodemailer from "nodemailer";

/**
 * 📧 EMAIL SERVICE
 * Envia emails transacionais para pedidos
 */

// Configurar transportador
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ========================================
// 📧 ENVIAR EMAIL PEDIDO CONFIRMADO
// ========================================
export const sendOrderConfirmationEmail = async (orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ productName: string; quantity: number; totalPrice: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  street: string;
  number: string;
  city: string;
  state: string;
}) => {
  try {
    const itemsHTML = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.totalPrice.toFixed(2)}</td>
        </tr>
      `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #c41e3a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
            .section { margin: 20px 0; padding: 15px; background-color: white; border-left: 4px solid #c41e3a; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            .total-section { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; }
            .total-final { display: flex; justify-content: space-between; padding: 10px 0; font-size: 20px; font-weight: bold; color: #c41e3a; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { background-color: #c41e3a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Pedido Confirmado!</h1>
            </div>

            <div class="content">
              <div class="section">
                <h2>Olá, ${orderData.customerName}!</h2>
                <p>Seu pedido foi recebido com sucesso. Aqui estão os detalhes:</p>
              </div>

              <div class="section">
                <h3>📋 Número do Pedido</h3>
                <p style="font-size: 20px; font-weight: bold; color: #c41e3a;">${orderData.orderNumber}</p>
              </div>

              <div class="section">
                <h3>📦 Itens do Pedido</h3>
                <table>
                  <thead>
                    <tr style="background-color: #f0f0f0;">
                      <th style="padding: 10px; text-align: left;">Produto</th>
                      <th style="padding: 10px; text-align: center;">Quantidade</th>
                      <th style="padding: 10px; text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                  </tbody>
                </table>
              </div>

              <div class="total-section">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>R$ ${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>Frete:</span>
                  <span>R$ ${orderData.shipping.toFixed(2)}</span>
                </div>
                <div class="total-final">
                  <span>TOTAL:</span>
                  <span>R$ ${orderData.total.toFixed(2)}</span>
                </div>
              </div>

              <div class="section">
                <h3>📍 Endereço de Entrega</h3>
                <p>
                  ${orderData.street}, ${orderData.number}<br>
                  ${orderData.city}, ${orderData.state}
                </p>
              </div>

              <div class="section">
                <h3>⏭️ Próximos Passos</h3>
                <p>Você receberá um email de confirmação de pagamento em breve. Após o pagamento ser aprovado, sua compra será preparada para envio.</p>
                <center>
                  <a href="https://autozpro.com.br/order/${orderData.orderNumber}" class="button">Acompanhar Pedido</a>
                </center>
              </div>

              <div class="section">
                <p>Em caso de dúvidas, entre em contato conosco pelo telefone <strong>(14) 3277-2266</strong></p>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 B77 Auto Parts. Todos os direitos reservados.</p>
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: orderData.customerEmail,
      subject: `✓ Pedido Confirmado - ${orderData.orderNumber}`,
      html,
    });

    console.log(
      `✅ Email confirmação enviado para: ${orderData.customerEmail}`,
    );
  } catch (error) {
    console.error("❌ Erro ao enviar email confirmação:", error);
  }
};

// ========================================
// 💳 ENVIAR EMAIL PAGAMENTO CONFIRMADO
// ========================================
export const sendPaymentConfirmedEmail = async (orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
}) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
            .section { margin: 20px 0; padding: 15px; background-color: white; border-left: 4px solid #27ae60; }
            .button { background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Pagamento Confirmado!</h1>
            </div>

            <div class="content">
              <div class="section">
                <h2>Olá, ${orderData.customerName}!</h2>
                <p>Seu pagamento foi aprovado com sucesso!</p>
              </div>

              <div class="section">
                <h3>📋 Detalhes do Pedido</h3>
                <p><strong>Número:</strong> ${orderData.orderNumber}</p>
                <p><strong>Valor:</strong> R$ ${orderData.total.toFixed(2)}</p>
              </div>

              <div class="section">
                <h3>📦 Próximos Passos</h3>
                <p>Seu pedido será separado e preparado para envio. Você receberá um email com o código de rastreio assim que sair para entrega.</p>
                <center>
                  <a href="https://autozpro.com.br/order/${orderData.orderNumber}" class="button">Acompanhar Pedido</a>
                </center>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 B77 Auto Parts. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: orderData.customerEmail,
      subject: `💳 Pagamento Confirmado - ${orderData.orderNumber}`,
      html,
    });

    console.log(`✅ Email pagamento enviado para: ${orderData.customerEmail}`);
  } catch (error) {
    console.error("❌ Erro ao enviar email pagamento:", error);
  }
};

// ========================================
// 🚚 ENVIAR EMAIL PEDIDO ENVIADO
// ========================================
export const sendOrderShippedEmail = async (orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingCode?: string;
}) => {
  try {
    const trackingHTML = orderData.trackingCode
      ? `
      <div class="section">
        <h3>📮 Código de Rastreio</h3>
        <p style="font-size: 18px; font-weight: bold; color: #c41e3a;">
          ${orderData.trackingCode}
        </p>
        <p>Use este código para rastrear seu pedido nos Correios.</p>
        <a href="https://rastreamento.correios.com.br/app/resultado.php?objeto=${orderData.trackingCode}" class="button">
          Rastrear nos Correios
        </a>
      </div>
    `
      : "";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #3498db; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
            .section { margin: 20px 0; padding: 15px; background-color: white; border-left: 4px solid #3498db; }
            .button { background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚚 Seu Pedido Foi Enviado!</h1>
            </div>

            <div class="content">
              <div class="section">
                <h2>Olá, ${orderData.customerName}!</h2>
                <p>Ótimas notícias! Seu pedido saiu para entrega!</p>
              </div>

              <div class="section">
                <h3>📋 Número do Pedido</h3>
                <p style="font-size: 18px; font-weight: bold;">${orderData.orderNumber}</p>
              </div>

              ${trackingHTML}

              <div class="section">
                <h3>⏱️ Prazo de Entrega</h3>
                <p>Seu pedido chegará em até 7 dias úteis. Acompanhe o rastreio para saber exatamente quando será entregue.</p>
              </div>

              <div class="section">
                <p>Em caso de dúvidas, entre em contato conosco pelo telefone <strong>(14) 3277-2266</strong></p>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 B77 Auto Parts. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: orderData.customerEmail,
      subject: `🚚 Seu Pedido Foi Enviado! - ${orderData.orderNumber}`,
      html,
    });

    console.log(`✅ Email envio enviado para: ${orderData.customerEmail}`);
  } catch (error) {
    console.error("❌ Erro ao enviar email envio:", error);
  }
};

// ========================================
// ✅ ENVIAR EMAIL PEDIDO ENTREGUE
// ========================================
export const sendOrderDeliveredEmail = async (orderData: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
}) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
            .section { margin: 20px 0; padding: 15px; background-color: white; border-left: 4px solid #27ae60; }
            .button { background-color: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Pedido Entregue!</h1>
            </div>

            <div class="content">
              <div class="section">
                <h2>Olá, ${orderData.customerName}!</h2>
                <p>Seu pedido foi entregue com sucesso!</p>
              </div>

              <div class="section">
                <h3>📋 Número do Pedido</h3>
                <p style="font-size: 18px; font-weight: bold;">${orderData.orderNumber}</p>
              </div>

              <div class="section">
                <h3>⭐ Como foi sua compra?</h3>
                <p>Sua opinião é muito importante para nós! Nos ajude a melhorar deixando uma avaliação.</p>
                <center>
                  <a href="https://autozpro.com.br/order/${orderData.orderNumber}/review" class="button">
                    Deixar Avaliação
                  </a>
                </center>
              </div>

              <div class="section">
                <p>Obrigado por comprar na AutozPro! Esperamos vê-lo em breve!</p>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 B77 Auto Parts. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: orderData.customerEmail,
      subject: `✅ Pedido Entregue! - ${orderData.orderNumber}`,
      html,
    });

    console.log(`✅ Email entrega enviado para: ${orderData.customerEmail}`);
  } catch (error) {
    console.error("❌ Erro ao enviar email entrega:", error);
  }
};
