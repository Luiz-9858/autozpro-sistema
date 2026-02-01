import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productService, categoryService } from "../services/api";
import type { Product, PaginationData, Category } from "../services/api";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros ativos
  const categoryId = searchParams.get("categoryId") || undefined;
  const searchTerm = searchParams.get("search") || undefined;
  const currentPage = parseInt(searchParams.get("page") || "1");

  // 🔄 Função para buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar categorias:", error);
    }
  };

  // 🔄 Função para buscar produtos
  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await productService.getAll(
        page,
        20,
        categoryId,
        searchTerm,
      );

      if (response.success && response.data) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("❌ Erro ao buscar produtos:", err);
      setError("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar categorias ao montar
  useEffect(() => {
    fetchCategories();
  }, []);

  // Buscar produtos quando filtros mudarem
  useEffect(() => {
    fetchProducts(currentPage);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, categoryId, searchTerm]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      if (categoryId) params.set("categoryId", categoryId);
      if (searchTerm) params.set("search", searchTerm);

      window.history.pushState({}, "", `?${params.toString()}`);
      fetchProducts(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "https://placehold.co/300x300/1E293B/DC2626?text=Sem+Imagem";
  };

  const getCategoryName = () => {
    if (!categoryId) return null;
    const category = categories.find((c) => c.id === categoryId);
    return category?.name;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header com filtros ativos */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getCategoryName() || "Catálogo de Produtos"}
          </h1>

          {searchTerm && (
            <p className="text-gray-600 mb-2">
              Resultados para: <strong>"{searchTerm}"</strong>
            </p>
          )}

          <p className="text-gray-600">
            Exibindo {products.length} de {pagination.totalProducts} produtos
            {pagination.totalPages > 1 && (
              <span className="ml-2 text-sm">
                (Página {pagination.currentPage} de {pagination.totalPages})
              </span>
            )}
          </p>
        </div>

        {/* Estado de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Estado de carregamento */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
          </div>
        ) : (
          <>
            {/* Grid de produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Imagem */}
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={
                        product.imageUrl ||
                        "https://placehold.co/300x300/1E293B/DC2626?text=Sem+Imagem"
                      }
                      alt={product.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                    {product.salePrice && (
                      <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        PROMOÇÃO
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                        SEM ESTOQUE
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {product.category.name}
                    </span>

                    <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 h-10">
                      {product.name}
                    </h3>

                    <div className="mt-3">
                      {product.salePrice ? (
                        <div>
                          <p className="text-xs text-gray-500 line-through">
                            R$ {product.price.toFixed(2)}
                          </p>
                          <p className="text-lg font-bold text-primary">
                            R$ {product.salePrice.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-lg font-bold text-gray-900">
                          R$ {product.price.toFixed(2)}
                        </p>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-gray-600">
                      {product.stock > 0
                        ? `${product.stock} em estoque`
                        : "Indisponível"}
                    </p>

                    <button
                      disabled={product.stock === 0}
                      aria-label={`Adicionar ${product.name} ao carrinho`}
                      className={`mt-4 w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                        product.stock === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                    >
                      {product.stock === 0
                        ? "Indisponível"
                        : "Adicionar ao Carrinho"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                <button
                  onClick={() => goToPage(1)}
                  disabled={!pagination.hasPrevPage}
                  aria-label="Ir para a primeira página"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <i
                    className="fas fa-angle-double-left"
                    aria-hidden="true"
                  ></i>
                </button>

                <button
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  aria-label="Página anterior"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <i
                    className="fas fa-chevron-left mr-2"
                    aria-hidden="true"
                  ></i>
                  Anterior
                </button>

                <div className="px-6 py-2 bg-primary text-white rounded-md font-medium">
                  {pagination.currentPage} / {pagination.totalPages}
                </div>

                <button
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  aria-label="Próxima página"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Próxima
                  <i
                    className="fas fa-chevron-right ml-2"
                    aria-hidden="true"
                  ></i>
                </button>

                <button
                  onClick={() => goToPage(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                  aria-label="Ir para a última página"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <i
                    className="fas fa-angle-double-right"
                    aria-hidden="true"
                  ></i>
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-500 mt-4">
              Mostrando {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalProducts,
              )}{" "}
              de {pagination.totalProducts} produtos
            </div>
          </>
        )}
      </div>
    </div>
  );
}
