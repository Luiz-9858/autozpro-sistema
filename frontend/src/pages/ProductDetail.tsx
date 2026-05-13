import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "../services/api";
import type { Product } from "../services/api";
import AddToCartButton from "../components/AddToCartButton";

// 🚗 NOVO: Tipo para veículo
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  version?: string | null;
  engine?: string | null;
  fuelType?: string | null;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // 🚗 NOVO: Estado para accordion de veículos
  const [expandedBrands, setExpandedBrands] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await productService.getById(productId);

      if (response.success && response.data) {
        setProduct(response.data);
      } else {
        setError("Produto não encontrado");
      }
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setError("Erro ao carregar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 🚗 NOVO: Organizar veículos por marca
  const getVehiclesByBrand = () => {
    if (!product?.vehicles) return {};

    const vehiclesByBrand: Record<string, Vehicle[]> = {};

    product.vehicles.forEach((pv) => {
      const vehicle = pv.vehicle;
      if (!vehicle) return;

      const brand = vehicle.brand;
      if (!vehiclesByBrand[brand]) {
        vehiclesByBrand[brand] = [];
      }
      vehiclesByBrand[brand].push(vehicle);
    });

    // Ordenar veículos dentro de cada marca por ano (mais recente primeiro)
    Object.keys(vehiclesByBrand).forEach((brand) => {
      vehiclesByBrand[brand].sort((a, b) => b.year - a.year);
    });

    return vehiclesByBrand;
  };

  // 🚗 NOVO: Toggle accordion de marca
  const toggleBrand = (brand: string) => {
    setExpandedBrands((prev) => ({
      ...prev,
      [brand]: !prev[brand],
    }));
  };

  // 🚗 NOVO: Contar total de veículos
  const getTotalVehicles = () => {
    return product?.vehicles?.length || 0;
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 md:h-8 bg-gray-200 rounded w-1/2 md:w-1/3 mb-4 md:mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-gray-200 h-64 md:h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 md:h-12 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 md:h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Erro ou produto não encontrado
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <i className="fas fa-exclamation-circle text-4xl md:text-6xl text-red-500 mb-4"></i>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {error || "Produto não encontrado"}
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-6">
            O produto que você procura não existe ou foi removido.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition text-sm md:text-base"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar para o Catálogo
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const finalPrice = product.salePrice || product.price;
  const vehiclesByBrand = getVehiclesByBrand();
  const totalVehicles = getTotalVehicles();

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb - Simplificado no Mobile */}
        <nav
          className="mb-4 md:mb-6 text-xs md:text-sm"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-2 text-gray-600 overflow-x-auto pb-2">
            {/* Mobile: Apenas voltar */}
            <li className="lg:hidden">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 hover:text-primary"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Voltar</span>
              </button>
            </li>

            {/* Desktop: Breadcrumb completo */}
            <li className="hidden lg:block">
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li className="hidden lg:block">
              <i className="fas fa-chevron-right text-xs"></i>
            </li>
            <li className="hidden lg:block">
              <Link to="/products" className="hover:text-primary">
                Produtos
              </Link>
            </li>
            <li className="hidden lg:block">
              <i className="fas fa-chevron-right text-xs"></i>
            </li>
            <li className="hidden lg:block">
              <Link
                to={`/products?categoryId=${product.category.id}`}
                className="hover:text-primary"
              >
                {product.category.name}
              </Link>
            </li>
            <li className="hidden lg:block">
              <i className="fas fa-chevron-right text-xs"></i>
            </li>
            <li className="hidden lg:block text-gray-900 font-medium truncate max-w-xs">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
          {/* COLUNA ESQUERDA: Imagem */}
          <div>
            <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-3 md:mb-4">
              <img
                src={
                  imageError || !product.imageUrl
                    ? "https://placehold.co/800x800/F3F4F6/9CA3AF?text=Sem+Imagem"
                    : product.imageUrl
                }
                alt={product.name}
                onError={handleImageError}
                className="w-full h-auto object-contain max-h-[300px] md:max-h-[400px] lg:max-h-[500px]"
              />

              {/* Badges */}
              {product.salePrice && (
                <div className="absolute top-2 md:top-4 left-2 md:left-4">
                  <span className="bg-primary text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-md shadow-lg">
                    -{discountPercentage}% OFF
                  </span>
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute top-2 md:top-4 right-2 md:right-4">
                  <span className="bg-gray-900 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-md shadow-lg">
                    ESGOTADO
                  </span>
                </div>
              )}
            </div>

            {/* Compartilhar */}
            <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
              <span className="text-xs md:text-sm font-medium text-gray-700">
                Compartilhar:
              </span>
              <button
                className="text-gray-600 hover:text-blue-600 transition"
                aria-label="Compartilhar no Facebook"
              >
                <i className="fab fa-facebook text-lg md:text-xl"></i>
              </button>
              <button
                className="text-gray-600 hover:text-blue-400 transition"
                aria-label="Compartilhar no Twitter"
              >
                <i className="fab fa-twitter text-lg md:text-xl"></i>
              </button>
              <button
                className="text-gray-600 hover:text-green-600 transition"
                aria-label="Compartilhar no WhatsApp"
              >
                <i className="fab fa-whatsapp text-lg md:text-xl"></i>
              </button>
              <button
                className="text-gray-600 hover:text-gray-900 transition"
                aria-label="Copiar link"
              >
                <i className="fas fa-link text-lg md:text-xl"></i>
              </button>
            </div>
          </div>

          {/* COLUNA DIREITA: Informações */}
          <div>
            {/* Categoria */}
            <Link
              to={`/products?categoryId=${product.category.id}`}
              className="inline-block text-xs text-primary hover:text-red-700 uppercase tracking-wide mb-2 font-semibold"
            >
              {product.category.name}
            </Link>

            {/* Nome */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
              {product.name}
            </h1>

            {/* SKU */}
            <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
              <strong>SKU:</strong> {product.sku}
            </p>

            {/* Preço */}
            <div className="mb-4 md:mb-6">
              {product.salePrice ? (
                <>
                  <p className="text-base md:text-lg text-gray-500 line-through mb-1">
                    De: R$ {product.price.toFixed(2)}
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">
                    Por: R$ {product.salePrice.toFixed(2)}
                  </p>
                  <p className="text-xs md:text-sm text-green-600 font-semibold">
                    Economize R${" "}
                    {(product.price - product.salePrice).toFixed(2)} (
                    {discountPercentage}%)
                  </p>
                </>
              ) : (
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  R$ {product.price.toFixed(2)}
                </p>
              )}

              {/* Parcelamento */}
              {product.stock > 0 && (
                <p className="text-xs md:text-sm text-gray-600 mt-2 md:mt-3">
                  ou em até{" "}
                  <strong className="text-gray-900">
                    10x de R$ {(finalPrice / 10).toFixed(2)}
                  </strong>{" "}
                  sem juros
                </p>
              )}
            </div>

            {/* Estoque */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-700">
                  <i className="fas fa-check-circle text-lg md:text-xl"></i>
                  <span className="text-sm md:text-base font-semibold">
                    {product.stock}{" "}
                    {product.stock === 1
                      ? "unidade disponível"
                      : "unidades disponíveis"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <i className="fas fa-times-circle text-lg md:text-xl"></i>
                  <span className="text-sm md:text-base font-semibold">
                    Produto esgotado
                  </span>
                </div>
              )}

              {/* Frete Grátis */}
              {finalPrice >= 299 && product.stock > 0 && (
                <div className="flex items-center gap-2 text-green-600 mt-3 pt-3 border-t">
                  <i className="fas fa-truck text-lg md:text-xl"></i>
                  <span className="text-sm md:text-base font-semibold">
                    Frete Grátis para todo Brasil
                  </span>
                </div>
              )}
            </div>

            {/* Seletor de Quantidade */}
            {product.stock > 0 && (
              <div className="mb-4 md:mb-6">
                <label
                  htmlFor="quantity-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Quantidade:
                </label>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="px-3 md:px-4 py-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Diminuir quantidade"
                    >
                      <i className="fas fa-minus text-sm"></i>
                    </button>
                    <input
                      id="quantity-input"
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      min="1"
                      max={product.stock}
                      aria-label="Quantidade do produto"
                      title="Quantidade"
                      className="w-12 md:w-16 text-center border-x border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm md:text-base"
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="px-3 md:px-4 py-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Aumentar quantidade"
                    >
                      <i className="fas fa-plus text-sm"></i>
                    </button>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">
                    (máx: {product.stock})
                  </span>
                </div>
              </div>
            )}

            {/* Botão Adicionar ao Carrinho */}
            <div className="mb-4 md:mb-6">
              <AddToCartButton
                product={product}
                variant="primary"
                size="lg"
                fullWidth
              />
            </div>

            {/* Descrição */}
            {product.description && (
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                  Descrição do Produto
                </h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Informações Extras */}
            <div className="border-t pt-4 md:pt-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Informações do Produto
              </h3>
              <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoria:</span>
                  <span className="font-semibold text-gray-900">
                    {product.category.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-semibold text-gray-900">
                    {product.sku}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Disponibilidade:</span>
                  <span
                    className={`font-semibold ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? "Em estoque" : "Esgotado"}
                  </span>
                </div>
              </div>
            </div>

            {/* 🚗 NOVO: Veículos Compatíveis */}
            <div className="border-t pt-4 md:pt-6 mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <i className="fas fa-car text-primary"></i>
                Veículos Compatíveis
                {totalVehicles > 0 && (
                  <span className="text-sm font-normal text-gray-600">
                    ({totalVehicles}{" "}
                    {totalVehicles === 1 ? "veículo" : "veículos"})
                  </span>
                )}
              </h3>

              {totalVehicles > 0 ? (
                <div className="space-y-2">
                  {Object.keys(vehiclesByBrand)
                    .sort()
                    .map((brand) => (
                      <div
                        key={brand}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Header do Accordion */}
                        <button
                          onClick={() => toggleBrand(brand)}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition text-left"
                        >
                          <div className="flex items-center gap-2">
                            <i className="fas fa-car text-gray-600 text-sm"></i>
                            <span className="font-semibold text-gray-900 text-sm md:text-base">
                              {brand}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({vehiclesByBrand[brand].length}{" "}
                              {vehiclesByBrand[brand].length === 1
                                ? "veículo"
                                : "veículos"}
                              )
                            </span>
                          </div>
                          <i
                            className={`fas fa-chevron-down text-gray-600 transition-transform text-sm ${
                              expandedBrands[brand] ? "rotate-180" : ""
                            }`}
                          ></i>
                        </button>

                        {/* Lista de Veículos */}
                        {expandedBrands[brand] && (
                          <div className="p-3 bg-white">
                            <ul className="space-y-2">
                              {vehiclesByBrand[brand].map((vehicle) => (
                                <li
                                  key={vehicle.id}
                                  className="flex items-start gap-2 text-xs md:text-sm text-gray-700 py-1"
                                >
                                  <i className="fas fa-check-circle text-green-600 mt-0.5"></i>
                                  <span>
                                    <strong>{vehicle.model}</strong>{" "}
                                    {vehicle.year}
                                    {vehicle.version && (
                                      <span className="text-gray-500">
                                        {" "}
                                        - {vehicle.version}
                                      </span>
                                    )}
                                    {vehicle.engine && (
                                      <span className="text-gray-500">
                                        {" "}
                                        ({vehicle.engine})
                                      </span>
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <i className="fas fa-info-circle text-3xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-gray-600">
                    Este produto ainda não possui compatibilidade específica
                    cadastrada.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Entre em contato para verificar a compatibilidade com seu
                    veículo.
                  </p>
                </div>
              )}
            </div>

            {/* Selos de Confiança */}
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t">
              <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
                <div>
                  <i className="fas fa-shield-alt text-2xl md:text-3xl text-primary mb-1 md:mb-2"></i>
                  <p className="text-xs text-gray-600">Compra Segura</p>
                </div>
                <div>
                  <i className="fas fa-undo text-2xl md:text-3xl text-primary mb-1 md:mb-2"></i>
                  <p className="text-xs text-gray-600">7 Dias para Troca</p>
                </div>
                <div>
                  <i className="fas fa-truck text-2xl md:text-3xl text-primary mb-1 md:mb-2"></i>
                  <p className="text-xs text-gray-600">Entrega Rápida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
