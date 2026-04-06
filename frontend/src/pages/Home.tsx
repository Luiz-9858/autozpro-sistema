import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/api";
import type { Product } from "../services/api";
import AddToCartButton from "../components/AddToCartButton";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [vehicleSelectorOpen, setVehicleSelectorOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(1, 4); // Primeiros 4 produtos
      if (response.success && response.data) {
        setFeaturedProducts(response.data.products);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-12 md:py-16 lg:py-20">
        {/* Background com classe CSS externa */}
        <div className="absolute inset-0 opacity-30 hero-background" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <p className="text-sm md:text-lg lg:text-xl mb-4 md:mb-6 text-gray-250">
              COMPRE AS MELHORES
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              <span className="text-accent-red">AUTOPEÇAS</span>
              <br />
              <span className="text-white">& ACESSÓRIOS</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-gray-300">
              Alta Qualidade - Desempenho Extremo
            </p>
            <Link
              to="/products"
              className="inline-block bg-secondary hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg uppercase shadow-lg transition text-sm md:text-base"
            >
              SAIBA MAIS
            </Link>
          </div>
        </div>
      </section>

      {/* Vehicle Selector */}
      <section className="bg-gray-800 py-4 md:py-6">
        <div className="container mx-auto px-4">
          {/* MOBILE: Accordion/Vertical */}
          <div className="lg:hidden">
            <button
              onClick={() => setVehicleSelectorOpen(!vehicleSelectorOpen)}
              className="w-full flex items-center justify-between text-white py-3 px-4 bg-gray-700 rounded-lg mb-3"
            >
              <div className="flex items-center gap-3">
                <i className="fas fa-truck text-xl"></i>
                <span className="font-semibold">Selecione Seu Veículo</span>
              </div>
              <i
                className={`fas fa-chevron-down transition-transform ${
                  vehicleSelectorOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>

            {vehicleSelectorOpen && (
              <div className="space-y-3 animate-fadeIn">
                <select
                  className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                  aria-label="Selecione o ano"
                >
                  <option>1️⃣ Escolher Ano</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                </select>

                <select
                  className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                  aria-label="Selecionar marca"
                >
                  <option>2️⃣ Selecionar Marca</option>
                  <option>Chevrolet</option>
                  <option>Fiat</option>
                  <option>Ford</option>
                  <option>Volkswagen</option>
                </select>

                <select
                  className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                  aria-label="Selecionar modelo"
                >
                  <option>3️⃣ Selecionar Modelo</option>
                  <option>Onix</option>
                  <option>Cruze</option>
                  <option>S10</option>
                </select>

                <select
                  className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                  aria-label="Selecionar peça"
                >
                  <option>4️⃣ Selecionar Peça</option>
                  <option>Filtro de Óleo</option>
                  <option>Pastilha de Freio</option>
                  <option>Velas</option>
                </select>

                <button className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg">
                  BUSCAR PEÇAS →
                </button>
              </div>
            )}
          </div>

          {/* DESKTOP: Horizontal */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-white text-lg xl:text-xl flex items-center gap-2 whitespace-nowrap">
              <i className="fas fa-truck"></i>
              <span>Selecione Seu Veículo</span>
            </div>
            <div className="flex-1 flex gap-3">
              <select
                className="flex-1 px-4 py-2 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                aria-label="Selecione o ano"
              >
                <option>1️⃣ Escolher Ano</option>
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
              <select
                className="flex-1 px-4 py-2 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                aria-label="Selecionar marca"
              >
                <option>2️⃣ Selecionar Marca</option>
                <option>Chevrolet</option>
                <option>Fiat</option>
                <option>Ford</option>
              </select>
              <select
                className="flex-1 px-4 py-2 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                aria-label="Selecionar modelo"
              >
                <option>3️⃣ Selecionar Modelo</option>
                <option>Onix</option>
                <option>Cruze</option>
              </select>
              <select
                className="flex-1 px-4 py-2 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none"
                aria-label="Selecionar peça"
              >
                <option>4️⃣ Selecionar Peça</option>
                <option>Filtro</option>
                <option>Freio</option>
              </select>
              <button className="bg-primary hover:bg-primary-dark text-white px-6 xl:px-8 py-2 rounded font-semibold transition whitespace-nowrap">
                IR →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Categorias Populares
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Sistema de Freios", icon: "🛞" },
              { name: "Bancos", icon: "💺" },
              { name: "Sistema de Escape", icon: "⚙️" },
              { name: "Suspensão", icon: "🔧" },
              { name: "Elétrica", icon: "🔋" },
              { name: "Iluminação", icon: "💡" },
              { name: "Rodas & Pneus", icon: "🚙" },
              { name: "Filtros", icon: "🔍" },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white p-4 md:p-6 rounded-lg shadow hover:shadow-lg transition text-center cursor-pointer"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl mb-2 md:mb-3">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-sm md:text-base">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">
              Produtos em Destaque
            </h2>
            <Link
              to="/products"
              className="text-primary hover:text-red-700 font-semibold text-sm md:text-base"
            >
              Ver todos →
            </Link>
          </div>

          {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border rounded-lg p-4 animate-pulse">
                  <div className="bg-gray-200 h-40 md:h-48 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            // Produtos Reais
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition"
                >
                  {/* Imagem */}
                  <Link to={`/products/${product.id}`}>
                    <div className="bg-gray-100 h-40 md:h-48 rounded mb-4 overflow-hidden">
                      <img
                        src={
                          product.imageUrl ||
                          "https://placehold.co/400x400/F3F4F6/9CA3AF?text=Sem+Imagem"
                        }
                        alt={product.name}
                        className="w-full h-full object-contain hover:scale-105 transition"
                      />
                    </div>
                  </Link>

                  {/* Nome */}
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-semibold mb-2 hover:text-primary transition line-clamp-2 text-sm md:text-base">
                      {product.name}
                    </h3>
                  </Link>

                  {/* SKU */}
                  <p className="text-gray-500 text-xs mb-3">
                    SKU: {product.sku}
                  </p>

                  {/* Preço e Botão */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.salePrice ? (
                        <>
                          <span className="text-xs md:text-sm text-gray-500 line-through">
                            R$ {product.price.toFixed(2)}
                          </span>
                          <span className="text-lg md:text-xl font-bold text-primary">
                            R$ {product.salePrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg md:text-xl font-bold text-gray-900">
                          R$ {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Botão Adicionar ao Carrinho */}
                    <AddToCartButton
                      product={product}
                      variant="primary"
                      size="sm"
                      fullWidth
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
