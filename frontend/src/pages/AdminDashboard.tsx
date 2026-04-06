import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../services/api";

interface DashboardStats {
  overview: {
    totalProducts: number;
    totalCategories: number;
    activeProducts: number;
    inactiveProducts: number;
    lowStockProducts: number;
    totalStock: number;
  };
  productsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    price: number;
    category: {
      name: string;
    };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
      setError("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm md:text-base">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          Visão geral do seu e-commerce
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total de Produtos */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                Total de Produtos
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {stats.overview.totalProducts}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3 md:p-4">
              <i className="fas fa-box text-xl md:text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        {/* Produtos Ativos */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                Produtos Ativos
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {stats.overview.activeProducts}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3 md:p-4">
              <i className="fas fa-check-circle text-xl md:text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        {/* Categorias */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                Categorias
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {stats.overview.totalCategories}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3 md:p-4">
              <i className="fas fa-folder text-xl md:text-2xl text-purple-600"></i>
            </div>
          </div>
        </div>

        {/* Estoque Baixo */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">
                Estoque Baixo
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {stats.overview.lowStockProducts}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3 md:p-4">
              <i className="fas fa-exclamation-triangle text-xl md:text-2xl text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos por Categoria */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
          Produtos por Categoria
        </h3>
        <div className="space-y-3">
          {stats.productsByCategory
            .sort((a, b) => b.count - a.count)
            .map((category) => (
              <div
                key={category.categoryId}
                className="flex items-center gap-3 md:gap-4"
              >
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      {category.categoryName}
                    </span>
                    <span className="text-xs md:text-sm font-semibold text-gray-900">
                      {category.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{
                        width: `${(category.count / stats.overview.totalProducts) * 100}%`,
                      }}
                      aria-hidden="true"
                    ></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Produtos com Estoque Baixo */}
      {stats.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Produtos com Estoque Baixo
            </h3>
            <Link
              to="/admin/products"
              className="text-primary hover:text-primary-dark font-medium text-sm"
            >
              Ver todos →
            </Link>
          </div>

          {/* Mobile: Cards */}
          <div className="lg:hidden space-y-3">
            {stats.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-3"
              >
                <p className="font-medium text-gray-900 text-sm mb-2">
                  {product.name}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{product.category.name}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">
                    {product.stock} un.
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-2">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Produto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Estoque
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Preço
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      R$ {product.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
