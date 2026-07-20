import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDocument: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  subtotal: number;
  shipping: number;
  total: number;
  status:
    | "PENDING"
    | "PAID"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  paymentMethod: string | null;
  paymentId: string | null;
  trackingCode: string | null;
  items: OrderItem[];
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
}

export default function MyOrders() {
  const { user, token } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  const itemsPerPage = 10;

  // Buscar pedidos
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      console.log("🔍 DEBUG fetchOrders:");
      console.log(" Response status:", response.status);
      console.log(" Response data:", data);
      console.log(" Token enviado:", token ? "SIM" : "NÃO");

      if (data.success) {
        setOrders(data.data || []);
      } else {
        toast.error("Erro ao buscar pedidos");
      }
    } catch (error) {
      console.error("❌ Erro ao buscar pedidos:", error);
      toast.error("Erro ao carregar seus pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  // Filtrar e buscar
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "TODOS" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Paginação
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Status badge
  const getStatusBadge = (status: string) => {
    const statusMap: {
      [key: string]: { color: string; label: string; icon: string };
    } = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Aguardando Pagamento",
        icon: "⏳",
      },
      PAID: { color: "bg-blue-100 text-blue-800", label: "Pago", icon: "✓" },
      PROCESSING: {
        color: "bg-purple-100 text-purple-800",
        label: "Em Separação",
        icon: "📦",
      },
      SHIPPED: {
        color: "bg-cyan-100 text-cyan-800",
        label: "Enviado",
        icon: "🚚",
      },
      DELIVERED: {
        color: "bg-green-100 text-green-800",
        label: "Entregue",
        icon: "✓",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800",
        label: "Cancelado",
        icon: "✗",
      },
      REFUNDED: {
        color: "bg-orange-100 text-orange-800",
        label: "Reembolsado",
        icon: "💰",
      },
    };

    const statusInfo = statusMap[status] || statusMap["PENDING"];

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}
      >
        {statusInfo.icon} {statusInfo.label}
      </span>
    );
  };

  // Formatar data
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // if (!user || !token) {
  //   return null;
  //}
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <i className="fas fa-lock text-4xl text-gray-400 mb-4"></i>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Acesso Restrito
          </p>
          <p className="text-gray-600 mb-6">
            Você precisa estar logado para ver seus pedidos
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meus Pedidos
          </h1>
          <p className="text-gray-600">
            Acompanhe o status e os detalhes de seus pedidos
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Número do pedido ou email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Filtro Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                aria-label="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="TODOS">Todos os Status</option>
                <option value="PENDING">Aguardando Pagamento</option>
                <option value="PAID">Pago</option>
                <option value="PROCESSING">Em Separação</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="REFUNDED">Reembolsado</option>
              </select>
            </div>

            {/* Botão Limpar */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("TODOS");
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Pedidos */}
        {loading ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-3xl text-red-600 mb-4"></i>
            <p className="text-gray-600">Carregando seus pedidos...</p>
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <i className="fas fa-box-open text-4xl text-gray-300 mb-4 block"></i>
            <p className="text-gray-600 mb-4">Nenhum pedido encontrado</p>
            <p className="text-sm text-gray-500">
              {searchTerm || statusFilter !== "TODOS"
                ? "Tente ajustar seus filtros de busca"
                : "Você ainda não realizou nenhum pedido. Vamos comprar algo?"}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Data
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            {order.orderNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            R$ {Number(order.total).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                          >
                            <i className="fas fa-eye"></i>
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  title="Página anterior"
                  aria-label="Página anterior"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-red-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  title="Próxima página"
                  aria-label="Próxima página"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Detalhes */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Detalhes do Pedido</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition"
                aria-label="Detalhes"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Número e Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número do Pedido</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedOrder.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>

              {/* Cliente */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  Dados do Cliente
                </p>
                <p className="text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-600">{selectedOrder.customerEmail}</p>
                <p className="text-gray-600">{selectedOrder.customerPhone}</p>
              </div>

              {/* Endereço */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  Endereço de Entrega
                </p>
                <p className="text-gray-900">
                  {selectedOrder.street}, {selectedOrder.number}
                  {selectedOrder.complement && ` - ${selectedOrder.complement}`}
                </p>
                <p className="text-gray-600">
                  {selectedOrder.neighborhood}, {selectedOrder.city} -{" "}
                  {selectedOrder.state}
                </p>
                <p className="text-gray-600">{selectedOrder.zipCode}</p>
              </div>

              {/* Itens */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3 font-semibold">
                  Itens do Pedido
                </p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-gray-600">SKU: {item.productSku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">
                          {item.quantity}x R${" "}
                          {Number(item.unitPrice).toFixed(2)}
                        </p>
                        <p className="font-semibold text-gray-900">
                          R$ {Number(item.totalPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Valores */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">
                    R$ {Number(selectedOrder.subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete:</span>
                  <span className="text-gray-900">
                    R$ {Number(selectedOrder.shipping).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-red-600">
                    R$ {Number(selectedOrder.total).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Rastreio */}
              {selectedOrder.trackingCode && (
                <div className="border-t pt-4 bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Código de Rastreio
                  </p>
                  <p className="font-mono font-bold text-blue-600 mb-3">
                    {selectedOrder.trackingCode}
                  </p>
                  <a
                    href={`https://rastreamento.correios.com.br/app/resultado.php?objeto=${selectedOrder.trackingCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Rastrear nos Correios
                  </a>
                </div>
              )}

              {/* Datas */}
              <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
                <p>Pedido em: {formatDate(selectedOrder.createdAt)}</p>
                {selectedOrder.paidAt && (
                  <p>Pago em: {formatDate(selectedOrder.paidAt)}</p>
                )}
                {selectedOrder.shippedAt && (
                  <p>Enviado em: {formatDate(selectedOrder.shippedAt)}</p>
                )}
                {selectedOrder.deliveredAt && (
                  <p>Entregue em: {formatDate(selectedOrder.deliveredAt)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
