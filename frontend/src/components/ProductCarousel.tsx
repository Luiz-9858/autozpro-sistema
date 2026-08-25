import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface CarouselProduct {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
  };
  stock: number;
  averageRating?: number;
  totalReviews?: number;
  totalSold?: number;
  discount?: number;
}

interface ProductCarouselProps {
  title: string;
  endpoint: string;
  icon: string;
  badgeText?: string;
  badgeColor?: string;
  limit?: number;
}

export default function ProductCarousel({
  title,
  endpoint,
  icon,
  badgeText,
  badgeColor = "bg-red-600",
  limit = 8,
}: ProductCarouselProps) {
  const [products, setProducts] = useState<CarouselProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products${endpoint}?limit=${limit}`,
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      } else {
        toast.error("Erro ao carregar produtos");
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, [endpoint, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleImageError = (productId: string) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fas fa-star text-xs ${
              star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          ></i>
        ))}
      </div>
    );
  };

  const renderBadge = (product: CarouselProduct) => {
    if (product.discount && product.discount > 0) {
      return (
        <div className="absolute top-2 right-2 animate-fade-in">
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded transform group-hover:scale-110 transition-transform duration-300">
            -{product.discount}%
          </span>
        </div>
      );
    }

    if (product.totalSold && product.totalSold > 0) {
      return (
        <div className="absolute top-2 right-2 animate-fade-in">
          <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded transform group-hover:scale-110 transition-transform duration-300">
            🔥 {product.totalSold}
          </span>
        </div>
      );
    }

    if (product.averageRating && product.averageRating >= 4.5) {
      return (
        <div className="absolute top-2 right-2 animate-fade-in">
          <span className="bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded transform group-hover:scale-110 transition-transform duration-300">
            ⭐ {product.averageRating}
          </span>
        </div>
      );
    }

    return null;
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="py-8 md:py-12 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <i className={`fas ${icon} text-2xl text-primary`}></i>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow animate-pulse p-4"
            >
              <div className="bg-gray-200 h-40 rounded mb-3"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sem produtos
  if (products.length === 0) {
    return (
      <div className="py-8 md:py-12 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-4">
          <i className={`fas ${icon} text-2xl text-gray-400`}></i>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
        </div>
        <p className="text-gray-600">Nenhum produto disponível</p>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <i
            className={`fas ${icon} text-2xl md:text-3xl text-primary animate-bounce`}
          ></i>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {title}
          </h2>
          {badgeText && (
            <span
              className={`${badgeColor} text-white text-xs px-2 py-1 rounded animate-pulse`}
            >
              {badgeText}
            </span>
          )}
        </div>
        <Link
          to="/products"
          className="text-primary hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:gap-2"
        >
          Ver todos <i className="fas fa-arrow-right"></i>
        </Link>
      </div>

      {/* Grid Responsivo */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group bg-white rounded-lg shadow hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105 hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Imagem */}
            <div className="relative bg-gray-100 overflow-hidden h-40 md:h-48">
              <img
                src={
                  imageErrors.has(product.id) || !product.imageUrl
                    ? "https://placehold.co/200x200/F3F4F6/9CA3AF?text=Sem+Imagem"
                    : product.imageUrl
                }
                alt={product.name}
                onError={() => handleImageError(product.id)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Badge */}
              {renderBadge(product)}

              {/* Estoque */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                  <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold">
                    ESGOTADO
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 transition-all duration-300">
              {/* Categoria */}
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 group-hover:text-primary transition-colors duration-300">
                {product.category.name}
              </p>

              {/* Nome */}
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
                {product.name}
              </h3>

              {/* Rating */}
              {product.averageRating !== undefined && (
                <div className="flex items-center gap-1 mb-2 group-hover:scale-110 transform transition-transform duration-300 origin-left">
                  {renderStars(product.averageRating)}
                  <span className="text-xs text-gray-600">
                    ({product.totalReviews || 0})
                  </span>
                </div>
              )}

              {/* Preço */}
              <div className="mb-3">
                {product.salePrice ? (
                  <>
                    <p className="text-xs text-gray-500 line-through group-hover:text-gray-400 transition-colors duration-300">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-lg font-bold text-primary group-hover:text-red-700 transition-colors duration-300">
                      R$ {product.salePrice.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                    R$ {product.price.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Botão */}
              <button
                disabled={product.stock === 0}
                className="w-full bg-primary text-white py-2 rounded text-sm font-medium hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 hover:shadow-lg"
              >
                <i className="fas fa-shopping-cart mr-1"></i>
                Comprar
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
