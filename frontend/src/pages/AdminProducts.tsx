import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { productService } from "../services/api";
import type { Product } from "../services/api";
import { TableRowSkeleton } from "../components/Skeleton";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const response = await productService.getAll(
        page,
        20,
        undefined,
        searchTerm || undefined,
      );
      if (response.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Tem certeza que deseja deletar "${name}"?\n\nEsta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }

    try {
      await productService.delete(id);
      toast.success("Produto deletado com sucesso!");
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      toast.error("Erro ao deletar produto. Tente novamente.");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await productService.update(product.id, {
        isActive: !product.isActive,
      });
      toast.success(
        product.isActive
          ? "Produto desativado com sucesso!"
          : "Produto ativado com sucesso!",
      );
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
      toast.error("Erro ao atualizar produto");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Produtos
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to="/admin/products/new"
            className="bg-primary text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2 text-sm md:text-base font-semibold"
          >
            <i className="fas fa-plus"></i>
            Novo Produto
          </Link>
          <Link
            to="/admin/bulk-images"
            className="bg-blue-600 text-white px-4 py-2.5 md:py-2 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center text-sm md:text-base"
          >
            <i className="fas fa-images mr-2"></i>
            Upload em Massa
          </Link>
        </div>
      </div>

      {/* Busca */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar produtos..."
          className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          title="Buscar"
          aria-label="Buscar produtos"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="hidden lg:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? // 💀 SKELETON LOADING
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))
                : // ✅ DADOS REAIS
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <img
                            src={
                              product.imageUrl ||
                              "https://placehold.co/60x60/F3F4F6/9CA3AF?text=Sem+Img"
                            }
                            alt={product.name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">
                        {product.category.name}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4">
                        <div>
                          {product.salePrice ? (
                            <>
                              <p className="text-xs text-gray-500 line-through">
                                R$ {product.price.toFixed(2)}
                              </p>
                              <p className="text-xs md:text-sm font-semibold text-primary">
                                R$ {product.salePrice.toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs md:text-sm font-semibold text-gray-900">
                              R$ {product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4">
                        <span
                          className={`inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock === 0
                              ? "bg-red-100 text-red-800"
                              : product.stock < 5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.stock} un.
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium transition ${
                            product.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          <i
                            className={`fas ${product.isActive ? "fa-check-circle" : "fa-times-circle"} mr-1`}
                          ></i>
                          {product.isActive ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2 md:gap-3">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                            aria-label="Editar produto"
                          >
                            <i className="fas fa-edit text-base md:text-lg"></i>
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            className="text-red-600 hover:text-red-900"
                            title="Deletar"
                            aria-label="Deletar produto"
                          >
                            <i className="fas fa-trash text-base md:text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <div className="bg-white px-3 md:px-4 py-3 flex items-center justify-between border-t border-gray-200">
            {/* Mobile */}
            <div className="flex-1 flex justify-between md:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700 flex items-center">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Página <span className="font-medium">{currentPage}</span> de{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    title="Página anterior"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    title="Próxima página"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
