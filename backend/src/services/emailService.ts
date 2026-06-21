/**
 * 📧 EMAIL SERVICE - VERSÃO PROFISSIONAL
 * Templates bonitos e responsivos para e-commerce
 */

import nodemailer from "nodemailer";

// Configurar transportador
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ========================================
// 🎨 ESTILOS GLOBAIS
// ========================================
const globalStyles = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
  a { color: #c41e3a; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .container { max-width: 600px; margin: 0 auto; padding: 0; }
  .header { background: linear-gradient(135deg, #c41e3a 0%, #9a0000 100%); padding: 40px 20px; text-align: center; color: white; }
  .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
  .content { padding: 40px 20px; background-color: #ffffff; }
  .section { margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #c41e3a; }
  .section h3 { color: #c41e3a; margin-top: 0; }
  .button { background-color: #c41e3a; color: white; padding: 14px 28px; border-radius: 5px; display: inline-block; text-decoration: none; font-weight: bold; margin: 20px 0; }
  .button:hover { background-color: #9a0000; }
  .footer { background-color: #2c3e50; color: white; padding: 30px 20px; text-align: center; font-size: 12px; }
  .footer a { color: #3498db; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
  th { background-color: #f0f0f0; font-weight: bold; color: #333; }
  .total-section { background: linear-gradient(135deg, #f8f9fa 0%, #e8e9eb 100%); padding: 20px; border-radius: 8px; margin: 20px 0; }
  .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 16px; }
  .total-final { display: flex; justify-content: space-between; padding: 15px 0; font-size: 22px; font-weight: bold; color: #c41e3a; border-top: 2px solid #c41e3a; }
  .badge { display: inline-block; padding: 8px 12px; background-color: #27ae60; color: white; border-radius: 20px; font-size: 12px; font-weight: bold; }
  .icon { margin-right: 10px; }
  .text-center { text-align: center; }
  .mb-20 { margin-bottom: 20px; }
`;

// ========================================
// 📧 EMAIL 1: CONFIRMAÇÃO DE PEDIDO
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
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.productName}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">R$ ${item.totalPrice.toFixed(2)}</td>
        </tr>
      `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${globalStyles}</style>
        </head>
        <body>
          <div class="container">
            <!-- HEADER -->
            <div class="header">
              <div class="logo"><i class="fas fa-car"></i> B77 Auto Parts</div>
              <h1 style="margin: 0; font-size: 24px;"><i class="fas fa-check-circle"></i> Pedido Confirmado</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Seu pedido foi recebido com sucesso</p>
            </div>

            <!-- CONTEÚDO -->
            <div class="content">
              <!-- SAUDAÇÃO -->
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Olá <strong>${orderData.customerName}</strong>,<br>
                Obrigado por sua compra! Aqui está o resumo do seu pedido.
              </p>

              <!-- NÚMERO DO PEDIDO -->
              <div class="section" style="text-align: center; background: linear-gradient(135deg, #e8f4f8 0%, #f0fafb 100%); border-left: none;">
                <p style="color: #666; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Número do Pedido</p>
                <h2 style="color: #c41e3a; margin: 10px 0; font-size: 32px; font-family: 'Courier New', monospace;">${orderData.orderNumber}</h2>
                <p style="color: #999; margin: 0; font-size: 12px;">Guarde este número para rastrear seu pedido</p>
              </div>

              <!-- ITENS -->
              <div class="section">
                <h3 style="margin-top: 0;"><i class="fas fa-box"></i> Itens do Pedido</h3>
                <table>
                  <thead>
                    <tr style="background-color: #f0f0f0;">
                      <th>Produto</th>
                      <th style="text-align: center;">Qtd</th>
                      <th style="text-align: right;">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                  </tbody>
                </table>
              </div>

              <!-- VALORES -->
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

              <!-- ENDEREÇO -->
              <div class="section">
                <h3 style="margin-top: 0;"><i class="fas fa-map-marker-alt"></i> Endereço de Entrega</h3>
                <p style="margin: 0; line-height: 1.8;">
                  <strong>${orderData.street}, ${orderData.number}</strong><br>
                  ${orderData.city}, ${orderData.state}<br>
                </p>
              </div>

              <!-- PRÓXIMOS PASSOS -->
              <div class="section">
                <h3 style="margin-top: 0;"><i class="fas fa-arrow-right"></i> Próximos Passos</h3>
                <p style="margin: 0;">
                  ✓ Você receberá um email de confirmação de pagamento em breve<br>
                  ✓ Após aprovação, seu pedido será separado e preparado<br>
                  ✓ Você receberá o código de rastreio dos Correios<br>
                </p>
              </div>

              <!-- CTA -->
              <div class="text-center">
                <a href="https://autozpro.com.br/order/${orderData.orderNumber}" class="button">
                  ▶ Acompanhar Pedido
                </a>
              </div>

              <!-- SUPORTE -->
              <div class="section">
                <p style="margin: 0; font-size: 14px;">
                  📞 Dúvidas? Entre em contato:<br>
                  <strong>(14) 3277-2266</strong> | support@autozpro.com.br<br>
                  Atendimento: Segunda a Sexta, 08h às 18h
                </p>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
              <p style="margin: 0 0 15px 0;">
                <strong>AutozPro - Peças Automotivas de Qualidade</strong>
              </p>
              <p style="margin: 0 0 10px 0;">
                📍 R. Profa. Prosperina de Queirós, 2-134 - Bauru/SP<br>
                📧 support@autozpro.com.br | 📞 (14) 3277-2266
              </p>
              <p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #444; font-size: 11px;">
                © 2024 AutozPro. Todos os direitos reservados.<br>
                Este é um email automático, por favor não responda.
              </p>
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
// 💳 EMAIL 2: PAGAMENTO CONFIRMADO
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${globalStyles}</style>
        </head>
        <body>
          <div class="container">
            <!-- HEADER -->
            <div class="header">
              <div class="logo"><i class="fas fa-car"></i> B77 Auto Parts</div>
              <h1 style="margin: 0; font-size: 24px;"><i class="fas fa-credit-card"></i> Pagamento Confirmado</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Seu pagamento foi processado com sucesso</p>
            </div>

            <!-- CONTEÚDO -->
            <div class="content">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Oi <strong>${orderData.customerName}</strong>,<br>
                Excelentes notícias! Seu pagamento foi confirmado. 🎉
              </p>

              <!-- STATUS -->
              <div class="section" style="text-align: center; background: linear-gradient(135deg, #d4edda 0%, #e8f5e9 100%); border-left: 4px solid #27ae60;">
                <p style="color: #27ae60; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                  ✓ PAGAMENTO APROVADO
                </p>
                <h2 style="color: #27ae60; margin: 15px 0; font-size: 28px;">R$ ${orderData.total.toFixed(2)}</h2>
                <p style="color: #666; margin: 0; font-size: 12px;">Pedido: ${orderData.orderNumber}</p>
              </div>

              <!-- PRÓXIMAS AÇÕES -->
              <div class="section">
               <h3 style="margin-top: 0;"><i class="fas fa-tasks"></i> O Que Acontece Agora?</h3>
                <p style="margin: 0;"

                  <i class="fas fa-check" style="color: #27ae60; margin-right: 5px;"></i> Seu pedido será separado no nosso estoque
<i class="fas fa-check" style="color: #27ae60; margin-right: 5px;"></i> Será embalado com cuidado
<i class="fas fa-check" style="color: #27ae60; margin-right: 5px;"></i> Você receberá o código de rastreio
                  <strong style="color: #27ae60;">✓</strong> Acompanhe a entrega em tempo real
                </p>
              </div>

              <!-- PRAZO -->
              <div class="section" style="background: linear-gradient(135deg, #fff3cd 0%, #fffbea 100%); border-left: 4px solid #ffc107;">
                <h3 style="margin-top: 0;"><i class="fas fa-hourglass-end"></i> Prazo de Entrega</h3>
                <p style="margin: 0; color: #856404;">
                  <strong>3 a 7 dias úteis</strong> para regiões do Sul e Sudeste<br>
                  <strong>5 a 10 dias úteis</strong> para demais regiões
                </p>
              </div>

              <!-- CTA -->
              <div class="text-center">
                <a href="https://autozpro.com.br/order/${orderData.orderNumber}" class="button">
                  ▶ Acompanhar Pedido
                </a>
              </div>

              <!-- SUPORTE -->
              <div class="section">
                <p style="margin: 0; font-size: 14px;">
                  <strong>Precisa de ajuda?</strong><br>
                  Entre em contato: <strong>(14) 3277-2266</strong><br>
                  ou responda este email
                </p>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
              <p style="margin: 0 0 15px 0;">
                <strong>AutozPro - Peças Automotivas de Qualidade</strong>
              </p>
              <p style="margin: 0 0 10px 0;">
                📍 R. Profa. Prosperina de Queirós, 2-134 - Bauru/SP<br>
                📧 support@autozpro.com.br | 📞 (14) 3277-2266
              </p>
              <p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #444; font-size: 11px;">
                © 2024 AutozPro. Todos os direitos reservados.
              </p>
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
// 🚚 EMAIL 3: PEDIDO ENVIADO
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
      <div class="section" style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border-left: 4px solid #3498db;">
        <h3 style="margin-top: 0;"><i class="fas fa-barcode"></i> Código de Rastreio</h3>
        <p style="margin: 10px 0; font-size: 12px; color: #666; text-transform: uppercase;">Clique abaixo para rastrear:</p>
        <p style="margin: 15px 0; font-size: 20px; font-family: 'Courier New', monospace; font-weight: bold; color: #3498db;">${orderData.trackingCode}</p>
        <a href="https://rastreamento.correios.com.br/app/resultado.php?objeto=${orderData.trackingCode}" class="button" style="background-color: #3498db;">
          🔍 Rastrear nos Correios
        </a>
      </div>
    `
      : "";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${globalStyles}</style>
        </head>
        <body>
          <div class="container">
            <!-- HEADER -->
            <div class="header">
              <div class="logo"><i class="fas fa-car"></i> B77 Auto Parts</div>
              <h1 style="margin: 0; font-size: 24px;"><i class="fas fa-truck"></i> Seu Pedido Foi Enviado</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Acompanhe a entrega em tempo real</p>
            </div>

            <!-- CONTEÚDO -->
            <div class="content">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Olá <strong>${orderData.customerName}</strong>,<br>
                Ótimas notícias! Seu pedido saiu para entrega! 📦
              </p>

              <!-- STATUS -->
              <div class="section" style="text-align: center; background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%); border-left: none;">
                <p style="color: #01579b; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Pedido em Trânsito</p>
                <h2 style="color: #0277bd; margin: 15px 0; font-size: 28px;">Pedido ${orderData.orderNumber}</h2>
              </div>

              ${trackingHTML}

              <!-- INFORMAÇÕES -->
              <div class="section">
                <h3 style="margin-top: 0;"><i class="fas fa-clipboard"></i> Informações Importantes</h3>
                <p style="margin: 0; line-height: 1.8;">
                  <strong>📍 Status:</strong> Em trânsito com os Correios<br>
                  <strong>⏱️ Prazo:</strong> 3 a 7 dias úteis<br>
                  <strong>🔔 Notificações:</strong> Você receberá atualizações automáticas<br>
                  <strong>📮 Origem:</strong> Bauru, SP
                </p>
              </div>

              <!-- DICAS -->
              <div class="section" style="background: linear-gradient(135deg, #f0f4c3 0%, #fff9c4 100%); border-left: 4px solid #ffb300;">
                <h3 style="margin-top: 0;"><i class="fas fa-lightbulb"></i> Dica Importante</h3>
                <p style="margin: 0; color: #f57f17;">
                  Certifique-se de que alguém estará disponível para receber o pacote. Se não conseguir receber, o carteiro deixará um aviso.
                </p>
              </div>

              <!-- CTA -->
              <div class="text-center">
                <a href="https://autozpro.com.br/order/${orderData.orderNumber}" class="button">
                  ▶ Ver Detalhes do Pedido
                </a>
              </div>

              <!-- SUPORTE -->
              <div class="section">
                <p style="margin: 0; font-size: 14px;">
                  <strong>Problemas com a entrega?</strong><br>
                  <strong>(14) 3277-2266</strong> | support@autozpro.com.br
                </p>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
              <p style="margin: 0 0 15px 0;">
                <strong>AutozPro - Peças Automotivas de Qualidade</strong>
              </p>
              <p style="margin: 0 0 10px 0;">
                📍 R. Profa. Prosperina de Queirós, 2-134 - Bauru/SP<br>
                📧 support@autozpro.com.br | 📞 (14) 3277-2266
              </p>
              <p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #444; font-size: 11px;">
                © 2024 AutozPro. Todos os direitos reservados.
              </p>
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
// ✅ EMAIL 4: PEDIDO ENTREGUE
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${globalStyles}</style>
        </head>
        <body>
          <div class="container">
            <!-- HEADER -->
            <div class="header">
              <div class="logo"><i class="fas fa-car"></i> B77 Auto Parts</div>
              <h1 style="margin: 0; font-size: 24px;"><i class="fas fa-check"></i> Pedido Entregue</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Sua compra chegou com segurança</p>
            </div>

            <!-- CONTEÚDO -->
            <div class="content">
              <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Parabéns <strong>${orderData.customerName}</strong>!<br>
                Seu pedido foi entregue com sucesso! 🎉
              </p>

              <!-- STATUS -->
              <div class="section" style="text-align: center; background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%); border-left: none;">
                <p style="color: #1b5e20; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                  ✓ ENTREGUE COM SUCESSO
                </p>
                <h2 style="color: #2e7d32; margin: 15px 0; font-size: 28px;">Pedido ${orderData.orderNumber}</h2>
              </div>

              <!-- AVALIAÇÃO -->
              <div class="section">
                <h3 style="margin-top: 0;"><i class="fas fa-star"></i> Como Foi Sua Experiência?</h3>
                <p style="margin: 0 0 15px 0; color: #666;">
                  Sua opinião é muito importante para nós! Avalie sua compra e ajude outros clientes.
                </p>
                <a href="https://autozpro.com.br/order/${orderData.orderNumber}/review" class="button" style="background-color: #ff9800;">
                  ⭐ Deixar Avaliação
                </a>
              </div>

              <!-- PRÓXIMAS COMPRAS -->
              <div class="section" style="background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%); border-left: 4px solid #009688;">
                <h3 style="margin-top: 0;"><i class="fas fa-shopping-bag"></i> Volte em Breve!</h3>
                <p style="margin: 0; color: #00695c;">
                  Confira nossas novas peças e promoções. Estamos sempre atualizando nosso catálogo com produtos de alta qualidade.
                </p>
              </div>

              <!-- CTA -->
              <div class="text-center">
                <a href="https://autozpro.com.br/products" class="button" style="background-color: #009688;">
                  ▶ Ver Mais Produtos
                </a>
              </div>

              <!-- OBRIGADO -->
              <div class="section" style="text-align: center;">
                <p style="margin: 0; font-size: 16px;">
                  <strong>Obrigado por escolher a B77 Auto Parts!</strong><br>
                  <span style="color: #999;">Seu feedback nos ajuda a melhorar cada vez mais</span>
                </p>
              </div>

              <!-- SUPORTE -->
              <div class="section">
                <p style="margin: 0; font-size: 14px;">
                  <strong>Algum problema com o produto?</strong><br>
                  <strong>(14) 3277-2266</strong> | support@autozpro.com.br<br>
                  Temos uma política de devolução de 30 dias
                </p>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
              <p style="margin: 0 0 15px 0;">
                <strong>AutozPro - Peças Automotivas de Qualidade</strong>
              </p>
              <p style="margin: 0 0 10px 0;">
                📍 R. Profa. Prosperina de Queirós, 2-134 - Bauru/SP<br>
                📧 support@autozpro.com.br | 📞 (14) 3277-2266
              </p>
              <p style="margin: 15px 0 0 0; padding-top: 15px; border-top: 1px solid #444; font-size: 11px;">
                © 2024 AutozPro. Todos os direitos reservados.<br>
                Este é um email automático, por favor não responda.
              </p>
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
