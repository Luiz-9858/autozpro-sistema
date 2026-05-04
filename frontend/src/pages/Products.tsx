import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { productService, categoryService } from "../services/api";
import type { Product, PaginationData, Category } from "../services/api";
import ProductCard from "../components/layout/ProductCard";
import { useVehicleStore } from "../store/vehicleStore"; // 🚗 NOVO

export default function Products() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🚗 NOVO: Veículo selecionado
  const { selectedVehicle, clearVehicle, getVehicleLabel } = useVehicleStore();

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filtros ativos
  const categoryId = searchParams.get("categoryId") || undefined;
  const searchTerm = searchParams.get("search") || undefined;
  const currentPage = parseInt(searchParams.get("page") || "1");
  const sortBy = searchParams.get("sort") || "recent";
  const onlyPromo = searchParams.get("promo") === "true";
  const onlyStock = searchParams.get("stock") === "true";

  // Bloquear scroll quando drawer aberto
  useEffect(() => {
    if (filtersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [filtersOpen]);

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

      // 🚗 NOVO: Passar vehicleId para API
      const response = await productService.getAll(
        page,
        20,
        categoryId,
        searchTerm,
        selectedVehicle.vehicleId || undefined, // 🚗 ADICIONAR
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

  // 🚗 NOVO: Buscar produtos quando veículo mudar também
  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    categoryId,
    searchTerm,
    sortBy,
    onlyPromo,
    onlyStock,
    selectedVehicle.vehicleId,
  ]);

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
    setFiltersOpen(false); // Fechar drawer após aplicar filtro
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
    clearVehicle(); // 🚗 NOVO: Limpar veículo também
    setFiltersOpen(false);
  };

  // 🚗 NOVO: Incluir veículo nos filtros ativos
  const hasActiveFilters =
    categoryId ||
    searchTerm ||
    onlyPromo ||
    onlyStock ||
    sortBy !== "recent" ||
    selectedVehicle.vehicleId;

  const countActiveFilters = () => {
    let count = 0;
    if (categoryId) count++;
    if (onlyPromo) count++;
    if (onlyStock) count++;
    if (sortBy !== "recent") count++;
    if (selectedVehicle.vehicleId) count++; // 🚗 NOVO
    return count;
  };

  // Componente de Filtros (reutilizado em desktop e drawer)
  const FiltersContent = () => (
    <div className="space-y-4">
      {/* 🚗 NOVO: Mostrar veículo selecionado */}
      {selectedVehicle.vehicleId && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <i className="fas fa-car"></i>
              Veículo Selecionado
            </span>
            <button
              onClick={clearVehicle}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="Remover filtro"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p className="text-sm text-blue-700 font-semibold">
            {getVehicleLabel()}
          </p>
        </div>
      )}

      {/* Ordenação */}
      <div>
        <label
          htmlFor="sort"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          <i className="fas fa-sort mr-2"></i>
          Ordenar por
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="recent">Mais recentes</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="name-asc">Nome (A-Z)</option>
        </select>
      </div>

      {/* Filtro: Categoria */}
      {categories.length > 0 && (
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            <i className="fas fa-folder mr-2"></i>
            Categoria
          </label>
          <select
            id="category"
            value={categoryId || ""}
            onChange={(e) =>
              updateFilters({ categoryId: e.target.value || null })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
        <input
          type="checkbox"
          checked={onlyPromo}
          onChange={(e) =>
            updateFilters({ promo: e.target.checked ? "true" : null })
          }
          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <span className="text-sm text-gray-700 flex items-center gap-2">
          <i className="fas fa-tag text-primary"></i>
          Apenas Promoções
        </span>
      </label>

      {/* Filtro: Apenas em Estoque */}
      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
        <input
          type="checkbox"
          checked={onlyStock}
          onChange={(e) =>
            updateFilters({ stock: e.target.checked ? "true" : null })
          }
          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <span className="text-sm text-gray-700 flex items-center gap-2">
          <i className="fas fa-check-circle text-green-600"></i>
          Apenas em Estoque
        </span>
      </label>

      {/* Botão Limpar Filtros */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-primary hover:text-red-700 font-medium py-2 border border-primary rounded-lg hover:bg-red-50 transition"
        >
          <i className="fas fa-times mr-2"></i>
          Limpar Todos os Filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {getCategoryName() || "Catálogo de Produtos"}
          </h1>

          {/* 🚗 NOVO: Banner de veículo selecionado */}
          {selectedVehicle.vehicleId && (
            <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-3">
              <i className="fas fa-car text-blue-600"></i>
              <span className="text-gray-700">
                Mostrando peças compatíveis com:{" "}
                <strong className="text-blue-700">{getVehicleLabel()}</strong>
              </span>
              <button
                onClick={clearVehicle}
                className="ml-auto text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                Limpar filtro
              </button>
            </div>
          )}

          {searchTerm && (
            <p className="text-sm md:text-base text-gray-600 mb-2">
              Resultados para: <strong>"{searchTerm}"</strong>
            </p>
          )}

          <p className="text-sm md:text-base text-gray-600">
            {products.length}{" "}
            {products.length === 1
              ? "produto encontrado"
              : "produtos encontrados"}
          </p>
        </div>

        {/* Botão Filtros Mobile - APENAS MOBILE */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary px-4 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition"
          >
            <i className="fas fa-filter"></i>
            <span>Filtros e Ordenação</span>
            {countActiveFilters() > 0 && (
              <span className="bg-primary text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {countActiveFilters()}
              </span>
            )}
          </button>
        </div>

        {/* Filtros Desktop - APENAS DESKTOP */}
        <div className="hidden lg:block mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <FiltersContent />
        </div>

        {/* Drawer Mobile */}
        {filtersOpen && (
          <>
            {/* Overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setFiltersOpen(false)}
            />

            {/* Drawer */}
            <div className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
              {/* Header do Drawer */}
              <div className="bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <i className="fas fa-filter"></i>
                  <span className="font-semibold">Filtros e Ordenação</span>
                  {countActiveFilters() > 0 && (
                    <span className="bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                      {countActiveFilters()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors p-2"
                  aria-label="Fechar filtros"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {/* Conteúdo do Drawer */}
              <div className="p-4">
                <FiltersContent />
              </div>
            </div>
          </>
        )}

        {/* Estado de erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 md:mb-6 text-sm md:text-base">
            {error}
          </div>
        )}

        {/* Estado de carregamento */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                <div className="bg-gray-200 h-48 md:h-56 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          // 🚗 NOVO: Mensagem personalizada quando não tem produtos
          <div className="text-center py-12 bg-white rounded-lg">
            <i className="fas fa-box-open text-4xl md:text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
              Nenhum produto encontrado
            </h3>
            {selectedVehicle.vehicleId ? (
              <>
                <p className="text-sm md:text-base text-gray-500 mb-4">
                  Não encontramos peças compatíveis com{" "}
                  <strong>{getVehicleLabel()}</strong>
                </p>
                <button
                  onClick={clearVehicle}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm md:text-base"
                >
                  Limpar filtro de veículo
                </button>
              </>
            ) : (
              <>
                <p className="text-sm md:text-base text-gray-500 mb-4">
                  Tente ajustar os filtros ou fazer uma nova busca
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm md:text-base"
                  >
                    Limpar Filtros
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {/* Grid de produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <>
                {/* Paginação Mobile - SIMPLES */}
                <div className="lg:hidden flex justify-center items-center gap-3 mt-6 mb-4">
                  <button
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    aria-label="Página anterior"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>

                  <div className="px-4 py-2 bg-primary text-white rounded-md font-medium text-sm">
                    {pagination.currentPage} / {pagination.totalPages}
                  </div>

                  <button
                    onClick={() => goToPage(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    aria-label="Próxima página"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>

                {/* Paginação Desktop - COMPLETA */}
                <div className="hidden lg:flex justify-center items-center gap-2 mt-8 mb-4">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={!pagination.hasPrevPage}
                    aria-label="Ir para a primeira página"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-angle-double-left"></i>
                  </button>

                  <button
                    onClick={() => goToPage(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    aria-label="Página anterior"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-chevron-left mr-2"></i>
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
                    <i className="fas fa-chevron-right ml-2"></i>
                  </button>

                  <button
                    onClick={() => goToPage(pagination.totalPages)}
                    disabled={!pagination.hasNextPage}
                    aria-label="Ir para a última página"
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <i className="fas fa-angle-double-right"></i>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
