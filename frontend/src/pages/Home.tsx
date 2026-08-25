import VehicleSelector from "../components/VehicleSelector";
import HomeHero from "../sections/HomeHero";
import BestRated from "../sections/BestRated";
import BestSellers from "../sections/BestSellers";
import FeaturedProducts from "../sections/FeaturedProducts";

/**
 * 📄 HOME PAGE - PÁGINA INICIAL
 *
 * Estrutura limpa e focada:
 * 1. HomeHero - Banner topo
 * 2. VehicleSelector - Seletor de veículos
 * 3. BestRated - Melhores avaliados ⭐
 * 4. BestSellers - Mais vendidos 🔥
 * 5. FeaturedProducts - Em destaque 💎
 */

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* 1. Hero Section */}
      <HomeHero />

      {/* 2. Vehicle Selector */}
      <VehicleSelector />

      {/* 3. Best Rated Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <BestRated />
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <BestSellers />
        </div>
      </section>

      {/* 5. Featured Products Section */}
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FeaturedProducts />
        </div>
      </section>
    </div>
  );
};

export default Home;
