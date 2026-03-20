import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { productService, categoryService } from "../services/api";
import type { Product, PaginationData, Category } from "../services/api";
import ProductCard from "../components/layout/ProductCard";

export default function Products() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
  const sortBy = searchParams.get("sort") || "recent";
  const onlyPromo = searchParams.get("promo") === "true";
  const onlyStock = searchParams.get("stock") === "true";

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
        let filteredProducts = response.data.products;

        // Filtro: Apenas promoções
        if (onlyPromo) {
          filteredProducts = filteredProducts.filter(
            (p) => p.salePrice !== null,
          );
        }

        // Filtro: Apenas em estoque
        if (onlyStock) {
          filteredProducts = filteredProducts.filter((p) => p.stock > 0);
        }

        // Ordenação
        switch (sortBy) {
          case "price-asc":
            filteredProducts.sort((a, b) => {
              const priceA = a.salePrice || a.price;
              const priceB = b.salePrice || b.price;
              return priceA - priceB;
            });
            break;
          case "price-desc":
            filteredProducts.sort((a, b) => {
              const priceA = a.salePrice || a.price;
              const priceB = b.salePrice || b.price;
              return priceB - priceA;
            });
            break;
          case "name-asc":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "recent":
          default:
            // Já vem ordenado por createdAt DESC do backend
            break;
        }

        setProducts(filteredProducts);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, categoryId, searchTerm, sortBy, onlyPromo, onlyStock]);

  // Atualizar URL com filtros
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Resetar para página 1 ao mudar filtros
    params.set("page", "1");

    navigate(`?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      updateFilters({ page: page.toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getCategoryName = () => {
    if (!categoryId) return null;
    const category = categories.find((c) => c.id === categoryId);
    return category?.name;
  };

  const clearFilters = () => {
    navigate("/products");
  };

  const hasActiveFilters =
    categoryId || searchTerm || onlyPromo || onlyStock || sortBy !== "recent";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            {products.length}{" "}
            {products.length === 1
              ? "produto encontrado"
              : "produtos encontrados"}
          </p>
        </div>

        {/* Filtros e Ordenação */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Ordenação */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-gray-700"
              >
                Ordenar por:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="recent">Mais recentes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name-asc">Nome (A-Z)</option>
              </select>
            </div>

            {/* Filtro: Categoria */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Categoria:
                </label>
                <select
                  id="category"
                  value={categoryId || ""}
                  onChange={(e) =>
                    updateFilters({ categoryId: e.target.value || null })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todas</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.productCount})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtro: Apenas Promoções */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyPromo}
                onChange={(e) =>
                  updateFilters({ promo: e.target.checked ? "true" : null })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                <i className="fas fa-tag text-primary mr-1"></i>
                Apenas Promoções
              </span>
            </label>

            {/* Filtro: Apenas em Estoque */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyStock}
                onChange={(e) =>
                  updateFilters({ stock: e.target.checked ? "true" : null })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">
                <i className="fas fa-check-circle text-green-600 mr-1"></i>
                Apenas em Estoque
              </span>
            </label>

            {/* Botão Limpar Filtros */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-primary hover:text-red-700 font-medium"
              >
                <i className="fas fa-times mr-1"></i>
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Estado de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Estado de carregamento */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="bg-gray-200 h-56 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid de produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
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
          </>
        )}
      </div>
    </div>
  );
}
