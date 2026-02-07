import { useState } from "react";
import type { Product } from "../../services/api";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleAddToCart = () => {
    if (onAddToCart && product.stock > 0) {
      onAddToCart(product);
    }
  };

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200">
      {/* Imagem do Produto */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        <img
          src={
            imageError || !product.imageUrl
              ? "https://placehold.co/400x400/F3F4F6/9CA3AF?text=Sem+Imagem"
              : product.imageUrl
          }
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {/* Badge de Promoção */}
          {product.salePrice && (
            <span className="bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
              -{discountPercentage}%
            </span>
          )}

          {/* Badge Sem Estoque */}
          {product.stock === 0 && (
            <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg ml-auto">
              SEM ESTOQUE
            </span>
          )}
        </div>

        {/* Badge de Frete Grátis (simulado) */}
        {product.price > 299 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
              <i className="fas fa-truck text-xs"></i>
              Frete grátis
            </span>
          </div>
        )}
      </div>

      {/* Informações do Produto */}
      <div className="p-4">
        {/* Categoria */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category.name}
        </p>

        {/* Nome do Produto */}
        <h3
          className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3 h-10 leading-5"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Preços */}
        <div className="mb-3">
          {product.salePrice ? (
            <>
              <p className="text-xs text-gray-500 line-through mb-1">
                R$ {product.price.toFixed(2)}
              </p>
              <p className="text-2xl font-bold text-primary">
                R$ {product.salePrice.toFixed(2)}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                Economize R$ {(product.price - product.salePrice).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              R$ {product.price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Parcelamento (simulado - 10x sem juros) */}
        {product.stock > 0 && (
          <p className="text-xs text-gray-600 mb-3">
            em até{" "}
            <strong>
              10x de R$ {((product.salePrice || product.price) / 10).toFixed(2)}
            </strong>{" "}
            sem juros
          </p>
        )}

        {/* Estoque */}
        <div className="mb-4">
          {product.stock > 0 ? (
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="font-medium text-green-700">
                {product.stock} {product.stock === 1 ? "unidade" : "unidades"}{" "}
                disponível
                {product.stock === 1 ? "" : "is"}
              </span>
            </p>
          ) : (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <i className="fas fa-times-circle text-red-600"></i>
              <span className="font-medium text-red-600">
                Produto indisponível
              </span>
            </p>
          )}
        </div>

        {/* Botão Adicionar ao Carrinho */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
            product.stock === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-red-700 hover:shadow-lg active:scale-95"
          }`}
        >
          {product.stock === 0 ? (
            <>
              <i className="fas fa-ban mr-2"></i>
              Indisponível
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart mr-2"></i>
              Adicionar ao Carrinho
            </>
          )}
        </button>

        {/* Link Ver Detalhes */}
        {product.stock > 0 && (
          <button
            className="w-full mt-2 py-2 text-sm text-primary hover:text-red-700 font-medium transition-colors"
            aria-label={`Ver detalhes de ${product.name}`}
          >
            Ver detalhes
          </button>
        )}
      </div>
    </div>
  );
}
