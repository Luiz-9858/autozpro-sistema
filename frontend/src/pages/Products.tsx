import { useState, useEffect } from "react";
import { productService } from "../services/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  imageUrl: string;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Buscar produtos do backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll();

      if (response.success && response.data.products) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao carregar produtos. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Formatar preço em Real
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Calcular desconto percentual
  const getDiscount = (price: number, salePrice: number | null) => {
    if (!salePrice || salePrice >= price) return null;
    const discount = ((price - salePrice) / price) * 100;
    return Math.round(discount);
  };

  // Mudar de página
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, page: newPage });
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Gerar array de números de página para exibir
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
    const end = Math.min(pagination.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Nossos Produtos</h1>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Grid de Produtos */}
      {!loading && !error && (
        <>
          {/* Contador e info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Mostrando{" "}
              <span className="font-semibold">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              a{" "}
              <span className="font-semibold">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              de <span className="font-semibold">{pagination.total}</span>{" "}
              produtos
            </p>
            <p className="text-sm text-gray-500">
              Página {pagination.page} de {pagination.totalPages}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-lg p-4 hover:shadow-lg transition"
              >
                {/* Badge de Desconto */}
                {product.salePrice &&
                  getDiscount(product.price, product.salePrice) && (
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                      -{getDiscount(product.price, product.salePrice)}% OFF
                    </div>
                  )}

                {/* Imagem */}
                <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/300x300/E5E7EB/6B7280?text=Sem+Imagem";
                    }}
                  />
                </div>

                {/* Badge da Categoria */}
                <span className="text-xs text-primary font-semibold uppercase">
                  {product.category.name}
                </span>

                {/* Nome do Produto */}
                <h3 className="font-semibold mb-2 mt-1 line-clamp-2 min-h-[3rem]">
                  {product.name}
                </h3>

                {/* Descrição */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                  {product.description}
                </p>

                {/* SKU e Estoque */}
                <div className="text-xs text-gray-500 mb-3">
                  <span className="font-mono">SKU: {product.sku}</span>
                  {product.stock > 0 ? (
                    <span className="ml-2 text-green-600">
                      ✓ Em estoque ({product.stock})
                    </span>
                  ) : (
                    <span className="ml-2 text-red-600">✗ Indisponível</span>
                  )}
                </div>

                {/* Preços */}
                <div className="flex items-center justify-between">
                  <div>
                    {product.salePrice ? (
                      <>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(product.salePrice)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {/* Botão Comprar */}
                  <button
                    className="bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? "Comprar" : "Esgotado"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              {/* Botão Primeira Página */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Primeira página"
              >
                <i className="fas fa-angle-double-left"></i>
              </button>

              {/* Botão Anterior */}
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Página anterior"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* Números de Página */}
              {pagination.page > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
                  >
                    1
                  </button>
                  {pagination.page > 4 && <span className="px-2">...</span>}
                </>
              )}

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded border transition ${
                    pageNum === pagination.page
                      ? "bg-primary text-white border-primary font-bold"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {pagination.page < pagination.totalPages - 2 && (
                <>
                  {pagination.page < pagination.totalPages - 3 && (
                    <span className="px-2">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
                  >
                    {pagination.totalPages}
                  </button>
                </>
              )}

              {/* Botão Próximo */}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Próxima página"
              >
                <i className="fas fa-chevron-right"></i>
              </button>

              {/* Botão Última Página */}
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                aria-label="Última página"
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </div>
          )}

          {/* Mensagem se não houver produtos */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhum produto encontrado.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
