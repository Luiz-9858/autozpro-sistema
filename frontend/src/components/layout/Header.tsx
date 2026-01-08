import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a
              href="tel:1432772266"
              className="flex items-center gap-2 hover:text-accent"
            >
              <i className="fas fa-phone"></i>
              <span>(14) 3277-2266</span>
            </a>
            <span className="hidden md:flex items-center gap-2">
              <i className="fas fa-map-marker-alt"></i>
              <span>R. Profa. Prosperina de Queirós, 2-134 - Bauru/SP</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <i className="fas fa-truck"></i>
              <span className="hidden md:inline">
                Frete Grátis acima de R$ 299
              </span>
            </span>
            <span className="flex items-center gap-2">
              <i className="fas fa-shield-alt"></i>
              <span className="hidden md:inline">Compra 100% Segura</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/image.png"
                alt="B77 Auto Parts"
                className="h-20 w-auto"
                onError={(e) => {
                  // Fallback caso logo não exista
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling!.classList.remove(
                    "hidden"
                  );
                }}
              />
              <div className="hidden">
                <div className="text-2xl font-bold text-secondary">
                  B77 <span className="text-primary">AUTO</span>
                </div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  Peças Automotivas
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar peças, categorias, marcas..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                />
                <button
                  aria-label="Buscar produtos"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-6">
              {/* Login */}
              <Link
                to="/login"
                className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition"
              >
                <i className="fas fa-user text-xl"></i>
                <span className="text-xs hidden md:block">Entrar</span>
              </Link>

              {/* Favorites */}
              <Link
                to="/favoritos"
                className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition"
              >
                <i className="fas fa-heart text-xl"></i>
                <span className="text-xs hidden md:block">Favoritos</span>
              </Link>

              {/* Cart */}
              <Link
                to="/carrinho"
                className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition relative"
              >
                <i className="fas fa-shopping-cart text-xl"></i>
                <span className="text-xs hidden md:block">Carrinho</span>
                {/* Badge de quantidade */}
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  0
                </span>
              </Link>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-4 border-t pt-4">
            <ul className="flex items-center gap-6 text-sm font-medium">
              <li>
                <Link
                  to="/products"
                  className="text-secondary hover:text-primary transition flex items-center gap-2"
                >
                  <i className="fas fa-th-large"></i>
                  Todas as Peças
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=motor"
                  className="text-secondary hover:text-primary transition"
                >
                  Motor
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=freios"
                  className="text-secondary hover:text-primary transition"
                >
                  Freios
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=suspensao"
                  className="text-secondary hover:text-primary transition"
                >
                  Suspensão
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=eletrica"
                  className="text-secondary hover:text-primary transition"
                >
                  Elétrica
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=filtros"
                  className="text-secondary hover:text-primary transition"
                >
                  Filtros
                </Link>
              </li>
              <li>
                <Link
                  to="/promocoes"
                  className="text-primary hover:text-primary-dark transition flex items-center gap-2 font-bold"
                >
                  <i className="fas fa-fire"></i>
                  Promoções
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
