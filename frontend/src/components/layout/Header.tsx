import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useState, useEffect } from "react";
import { categoryService } from "../../services/api";
import type { Category } from "../../services/api";
import CartBadge from "../CartBadge";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (mounted && response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar categorias:", error);
      }
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // Fechar menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bloquear scroll quando menu mobile aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?categoryId=${categoryId}`);
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Barra superior vermelha - APENAS DESKTOP */}
      <div className="bg-primary text-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <span>
                <i className="fas fa-phone mr-2"></i>
                (14) 3277-2266
              </span>
              <span>
                <i className="fas fa-map-marker-alt mr-2"></i>
                R. Profa. Prosperina de Queirós, 2-134 - Bauru/SP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-truck mr-1"></i>
              Frete Grátis acima de R$ 299
              <span className="mx-2">|</span>
              <i className="fas fa-shield-alt mr-1"></i>
              Compra 100% Segura
            </div>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Botão Menu Mobile - APENAS MOBILE/TABLET */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-primary transition-colors p-2"
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0" onClick={handleLinkClick}>
            <img
              src="/logo.png"
              alt="B77 Auto Parts"
              className="h-8 sm:h-10 lg:h-12"
            />
          </Link>

          {/* Busca - APENAS DESKTOP */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-2xl"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar peças, categorias, marcas..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {/* Ações do usuário */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Busca Mobile - APENAS MOBILE/TABLET */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden text-gray-700 hover:text-primary transition-colors p-2"
              aria-label="Buscar"
            >
              <i className="fas fa-search text-xl"></i>
            </button>

            {/* Login/Logout - VISÍVEL EM TODOS */}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden sm:flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
                  onClick={handleLinkClick}
                >
                  <i className="fas fa-user text-xl mb-1"></i>
                  <span className="text-xs hidden lg:block">Minha Conta</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <i className="fas fa-sign-out-alt text-xl mb-1"></i>
                  <span className="text-xs hidden lg:block">Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
                onClick={handleLinkClick}
              >
                <i className="fas fa-user text-xl mb-1"></i>
                <span className="text-xs hidden lg:block">Entrar</span>
              </Link>
            )}

            {/* Favoritos - APENAS DESKTOP */}
            <Link
              to="/favorites"
              className="hidden lg:flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
              onClick={handleLinkClick}
            >
              <i className="fas fa-heart text-xl mb-1"></i>
              <span className="text-xs">Favoritos</span>
            </Link>

            {/* Carrinho - VISÍVEL EM TODOS */}
            <div className="flex flex-col items-center">
              <CartBadge />
              <span className="text-xs text-gray-700 mt-1 hidden lg:block">
                Carrinho
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Busca Mobile Expansível */}
      {mobileSearchOpen && (
        <div className="lg:hidden bg-gray-50 border-t border-gray-200 px-4 py-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar peças..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu de categorias - APENAS DESKTOP */}
      <nav className="bg-secondary text-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-3">
            <Link
              to="/products"
              className="flex items-center gap-2 font-semibold hover:text-primary-light transition-colors"
              onClick={handleLinkClick}
            >
              <i className="fas fa-th"></i>
              Todas as Peças
            </Link>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="hover:text-primary-light transition-colors"
              >
                {category.name}
                <span className="ml-1 text-xs text-gray-400">
                  ({category.productCount})
                </span>
              </button>
            ))}

            <Link
              to="/promotions"
              className="flex items-center gap-2 text-primary-light font-semibold hover:text-white transition-colors ml-auto"
              onClick={handleLinkClick}
            >
              <i className="fas fa-tag"></i>
              Promoções
            </Link>
          </div>
        </div>
      </nav>

      {/* Overlay escuro - MOBILE/TABLET */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Menu Mobile - MOBILE/TABLET */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header do Menu Mobile */}
        <div className="bg-primary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <i className="fas fa-user-circle text-2xl"></i>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-200">{user.email}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <i className="fas fa-user-circle text-2xl"></i>
                <span className="font-semibold">Menu</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white hover:text-gray-200 transition-colors p-2"
            aria-label="Fechar menu"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Links do Menu */}
        <div className="p-4">
          {/* Conta do Usuário */}
          {user ? (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-tachometer-alt text-primary"></i>
                <span className="font-medium">Minha Conta</span>
              </Link>
              <Link
                to="/favorites"
                onClick={handleLinkClick}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-heart text-primary"></i>
                <span className="font-medium">Favoritos</span>
              </Link>
            </div>
          ) : (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-sign-in-alt text-primary"></i>
                <span className="font-medium">Entrar</span>
              </Link>
              <Link
                to="/register"
                onClick={handleLinkClick}
                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-user-plus text-primary"></i>
                <span className="font-medium">Criar Conta</span>
              </Link>
            </div>
          )}

          {/* Navegação Principal */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <Link
              to="/products"
              onClick={handleLinkClick}
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-th text-primary"></i>
              <span className="font-medium">Todas as Peças</span>
            </Link>
            <Link
              to="/promotions"
              onClick={handleLinkClick}
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-tag text-red-600"></i>
              <span className="font-medium">Promoções</span>
            </Link>
          </div>

          {/* Categorias */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">
              Categorias
            </h3>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                  {category.productCount}
                </span>
              </button>
            ))}
          </div>

          {/* Informações de Contato */}
          <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-4">
              Contato
            </h3>
            <div className="space-y-2 px-4">
              <a
                href="tel:1432772266"
                className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors"
              >
                <i className="fas fa-phone text-primary"></i>
                <span className="text-sm">(14) 3277-2266</span>
              </a>
              <div className="flex items-start gap-3 text-gray-700">
                <i className="fas fa-map-marker-alt text-primary mt-1"></i>
                <span className="text-sm">
                  R. Profa. Prosperina de Queirós, 2-134 - Bauru/SP
                </span>
              </div>
            </div>
          </div>

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="font-medium">Sair</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
