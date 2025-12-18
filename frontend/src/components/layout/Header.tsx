import { ShoppingCart, User, Menu, Search } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      {/* Top Bar */}
      <div className="bg-gray-800 py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <p>Bem-vindo à AutozPro - Loja Online</p>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <span>Olá, {user?.nome}</span>
                <button
                  onClick={logout}
                  className="hover:text-secondary"
                  aria-label="Sair da conta"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:text-secondary">
                  Entrar
                </a>
                <a href="/register" className="hover:text-secondary">
                  Cadastrar
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/" className="text-2xl font-bold text-white">
              <span className="text-primary">AUTOZ</span>
              <span className="text-secondary">PRO</span>
            </a>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar peças automotivas..."
                className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
                aria-label="Buscar produtos"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* User Icon */}
            <a
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="hover:text-secondary transition"
              aria-label="Minha conta"
            >
              <User size={24} />
            </a>

            {/* Cart */}
            <a
              href="/cart"
              className="relative hover:text-secondary transition"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden hover:text-secondary"
              aria-label="Menu de navegação"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar peças..."
              className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
              aria-label="Buscar produtos"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4">
          <ul className="hidden md:flex gap-8 py-3 text-sm font-medium">
            <li>
              <a href="/" className="hover:text-secondary transition">
                Início
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-secondary transition">
                Produtos
              </a>
            </li>
            <li>
              <a href="/categories" className="hover:text-secondary transition">
                Categorias
              </a>
            </li>
            <li>
              <a href="/offers" className="hover:text-secondary transition">
                Ofertas
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-secondary transition">
                Contato
              </a>
            </li>
          </ul>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <ul className="md:hidden py-4 space-y-3 text-sm">
              <li>
                <a href="/" className="block hover:text-secondary">
                  Início
                </a>
              </li>
              <li>
                <a href="/products" className="block hover:text-secondary">
                  Produtos
                </a>
              </li>
              <li>
                <a href="/categories" className="block hover:text-secondary">
                  Categorias
                </a>
              </li>
              <li>
                <a href="/offers" className="block hover:text-secondary">
                  Ofertas
                </a>
              </li>
              <li>
                <a href="/contact" className="block hover:text-secondary">
                  Contato
                </a>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
