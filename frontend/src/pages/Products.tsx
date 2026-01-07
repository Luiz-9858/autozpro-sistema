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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Buscar produtos do backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        console.log("RESPOSTA DA API:", response); // ← ADICIONE ESTA LINHA
        // A API retorna { success: true, data: { products: [...] } }
        if (response.success && response.data.products) {
          setProducts(response.data.products);
        }
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao carregar produtos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

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
          <p className="text-gray-600 mb-6">
            {products.length}{" "}
            {products.length === 1
              ? "produto encontrado"
              : "produtos encontrados"}
          </p>

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
                      // Fallback para imagem quebrada
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x300/E5E7EB/6B7280?text=Sem+Imagem";
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
                    className="bg-secondary hover:bg-secondary-dark text-gray-900 px-4 py-2 rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                  >
                    {product.stock > 0 ? "Comprar" : "Esgotado"}
                  </button>
                </div>
              </div>
            ))}
          </div>

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
