import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

interface Order {
  id: string;
  total: string | number;
  createdAt: string;
}

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const { items: cartItems } = useCartStore();

  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchUserStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/my-orders?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        const orders = data.data.reviews || [];
        const totalSpent = orders.reduce(
          (sum: number, order: Order) =>
            sum + parseFloat(String(order.total) || "0"),
          0,
        );
        const lastOrder = orders[0];

        setStats({
          totalOrders: orders.length,
          totalSpent: totalSpent,
          lastOrderDate: lastOrder?.createdAt || null,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Você não está autenticado
          </h1>
          <p className="text-gray-600 mb-6">
            Faça login para acessar seu painel
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header com dados do usuário */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 md:gap-6 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center">
              <i className="fas fa-user text-2xl md:text-3xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Bem-vindo, {user.name}!
              </h1>
              <p className="text-gray-600 text-sm md:text-base">{user.email}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <p className="text-gray-700 mb-3">
              <strong>ID da Conta:</strong> {user.id}
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Tipo:</strong>{" "}
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {user.role === "admin" ? "Administrador" : "Cliente"}
              </span>
            </p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pedidos */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Meus Pedidos
              </h3>
              <i className="fas fa-shopping-bag text-2xl text-primary"></i>
            </div>
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3"></div>
            ) : (
              <>
                <p className="text-4xl font-bold text-primary mb-2">
                  {stats.totalOrders}
                </p>
                <p className="text-sm text-gray-600">
                  {stats.totalOrders === 1
                    ? "pedido realizado"
                    : "pedidos realizados"}
                </p>
                {stats.lastOrderDate && (
                  <p className="text-xs text-gray-500 mt-2">
                    Último:{" "}
                    {new Date(stats.lastOrderDate).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </>
            )}
            <Link
              to="/my-orders"
              className="inline-block mt-4 text-primary hover:text-red-700 text-sm font-medium"
            >
              Ver meus pedidos <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>

          {/* Total Gasto */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Total Gasto
              </h3>
              <i className="fas fa-credit-card text-2xl text-green-600"></i>
            </div>
            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3"></div>
            ) : (
              <>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  R$ {stats.totalSpent.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  em {stats.totalOrders} compra(s)
                </p>
              </>
            )}
          </div>

          {/* Carrinho */}
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Meu Carrinho
              </h3>
              <i className="fas fa-shopping-cart text-2xl text-blue-600"></i>
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {cartItems.length}
            </p>
            <p className="text-sm text-gray-600">
              {cartItems.length === 1
                ? "item no carrinho"
                : "itens no carrinho"}
            </p>
            {cartItems.length > 0 && (
              <Link
                to="/cart"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ir para o carrinho <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            )}
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ações Rápidas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/products"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <i className="fas fa-shopping-bag text-primary text-xl"></i>
              <div>
                <p className="font-semibold text-gray-900">Comprar</p>
                <p className="text-xs text-gray-600">Voltar ao catálogo</p>
              </div>
            </Link>

            <Link
              to="/my-orders"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <i className="fas fa-box text-blue-600 text-xl"></i>
              <div>
                <p className="font-semibold text-gray-900">Pedidos</p>
                <p className="text-xs text-gray-600">Acompanhar entregas</p>
              </div>
            </Link>

            <button
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
              disabled
            >
              <i className="fas fa-heart text-red-600 text-xl"></i>
              <div>
                <p className="font-semibold text-gray-900">Favoritos</p>
                <p className="text-xs text-gray-600">Em breve...</p>
              </div>
            </button>

            <button
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
              disabled
            >
              <i className="fas fa-cog text-gray-600 text-xl"></i>
              <div>
                <p className="font-semibold text-gray-900">Configurações</p>
                <p className="text-xs text-gray-600">Em breve...</p>
              </div>
            </button>
          </div>
        </div>

        {/* Aviso se não tem pedidos */}
        {!loading && stats.totalOrders === 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <i className="fas fa-info-circle text-blue-600 text-3xl mb-3 block"></i>
            <p className="text-blue-900 font-semibold mb-2">
              Você ainda não fez nenhuma compra
            </p>
            <p className="text-blue-800 text-sm mb-4">
              Explore nosso catálogo e encontre os melhores produtos!
            </p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Começar a Comprar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
