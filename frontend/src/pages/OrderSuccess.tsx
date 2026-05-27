import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export default function OrderSuccess() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { clearCart } = useCartStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Limpar carrinho quando página carregar
    clearCart();

    // Buscar dados do pedido
    if (orderNumber) {
      fetchOrder(orderNumber);
    }
  }, [orderNumber, clearCart]);

  const fetchOrder = async (orderNum: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/orders/number/${orderNum}`,
      );

      const data = await response.json();

      if (data.success && data.data) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      PIX: "PIX",
      CREDIT_CARD: "Cartão de Crédito",
      DEBIT_CARD: "Cartão de Débito",
      BOLETO: "Boleto Bancário",
      TRANSFER: "Transferência Bancária",
    };
    return labels[method] || method;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { text: string; color: string }> = {
      PENDING: { text: "Aguardando Pagamento", color: "yellow" },
      PAID: { text: "Pago", color: "green" },
      PROCESSING: { text: "Em Separação", color: "blue" },
      SHIPPED: { text: "Enviado", color: "purple" },
      DELIVERED: { text: "Entregue", color: "green" },
      CANCELLED: { text: "Cancelado", color: "red" },
    };
    return labels[status] || { text: status, color: "gray" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Mensagem de Sucesso */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-3xl text-green-600"></i>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Pedido Realizado com Sucesso! 🎉
            </h1>
            <p className="text-gray-600">
              Obrigado pela sua compra! Seu pedido foi recebido e está sendo
              processado.
            </p>
          </div>

          {/* Número do Pedido */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-1">Número do Pedido</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-900">
              {orderNumber}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              Guarde este número para rastrear seu pedido
            </p>
          </div>

          {/* Próximos Passos */}
          {order && order.paymentMethod === "PIX" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-info-circle text-yellow-600 mt-1"></i>
                <div className="text-left">
                  <p className="font-semibold text-yellow-900 mb-1">
                    Próximo passo: Realizar o pagamento
                  </p>
                  <p className="text-sm text-yellow-800">
                    Você receberá um e-mail com o QR Code e código PIX para
                    pagamento. Após a confirmação do pagamento, iniciaremos a
                    separação do seu pedido.
                  </p>
                </div>
              </div>
            </div>
          )}

          {order && order.paymentMethod === "BOLETO" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-info-circle text-yellow-600 mt-1"></i>
                <div className="text-left">
                  <p className="font-semibold text-yellow-900 mb-1">
                    Próximo passo: Pagar o boleto
                  </p>
                  <p className="text-sm text-yellow-800">
                    Você receberá um e-mail com o boleto bancário. O pagamento
                    pode levar até 3 dias úteis para ser confirmado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detalhes do Pedido */}
        {order && (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Detalhes do Pedido
            </h2>

            <div className="space-y-3 text-sm md:text-base">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-semibold text-${getStatusLabel(order.status).color}-600`}
                >
                  {getStatusLabel(order.status).text}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Forma de Pagamento</span>
                <span className="font-semibold text-gray-900">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Valor Total</span>
                <span className="font-semibold text-gray-900 text-lg">
                  R$ {Number(order.total).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Data do Pedido</span>
                <span className="font-semibold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Itens do Pedido
              </h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.productName}
                    </span>
                    <span className="text-gray-900">
                      R$ {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* E-mail de Confirmação */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-3">
            <i className="fas fa-envelope text-primary text-xl mt-1"></i>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Confirmação por E-mail
              </h3>
              <p className="text-sm text-gray-600">
                Enviamos um e-mail de confirmação para{" "}
                <strong>{order?.customerEmail}</strong> com todos os detalhes do
                seu pedido e instruções de pagamento.
              </p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/products"
            className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
          >
            <i className="fas fa-shopping-bag mr-2"></i>
            Continuar Comprando
          </Link>

          <Link
            to="/"
            className="bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition text-center"
          >
            <i className="fas fa-home mr-2"></i>
            Voltar para Home
          </Link>
        </div>

        {/* Suporte */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Dúvidas sobre seu pedido?{" "}
            <Link
              to="/contact"
              className="text-primary hover:underline font-semibold"
            >
              Entre em contato
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
