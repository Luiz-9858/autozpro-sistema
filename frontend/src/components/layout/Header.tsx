import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-2 px-4">
        <div className="container mx-auto flex justify-between text-sm">
          <div className="flex gap-4">
            <span>📞 (11) 4002-8922</span>
            <span>📧 contato@b77autoparts.com.br</span>
          </div>
          <div className="flex gap-4">
            <span>🚚 Frete Grátis acima de R$ 299</span>
            <span>🔒 Compra 100% Segura</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold flex items-center">
            <span className="text-primary">AUTOZ</span>
            <span className="text-secondary">PRO</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar peças, categorias, marcas..."
                className="w-full py-3 px-4 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700">
                🔍
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
            {/* Usuário */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    Olá, {user.name.split(" ")[0]}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-primary hover:text-blue-700"
                  >
                    Sair
                  </button>
                </div>
                <Link to="/dashboard" className="text-3xl hover:text-primary">
                  👤
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex flex-col items-center hover:text-primary"
              >
                <span className="text-2xl">👤</span>
                <span className="text-xs">Entrar</span>
              </Link>
            )}

            {/* Favoritos */}
            <Link
              to="/favorites"
              className="flex flex-col items-center hover:text-primary"
            >
              <span className="text-2xl">❤️</span>
              <span className="text-xs">Favoritos</span>
            </Link>

            {/* Carrinho */}
            <Link
              to="/cart"
              className="flex flex-col items-center hover:text-primary relative"
            >
              <span className="text-2xl">🛒</span>
              <span className="text-xs">Carrinho</span>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex gap-8 py-3 text-sm font-medium">
            <li>
              <Link to="/products" className="hover:text-primary">
                Todas as Peças
              </Link>
            </li>
            <li>
              <Link to="/categories/motor" className="hover:text-primary">
                Motor
              </Link>
            </li>
            <li>
              <Link to="/categories/freios" className="hover:text-primary">
                Freios
              </Link>
            </li>
            <li>
              <Link to="/categories/suspensao" className="hover:text-primary">
                Suspensão
              </Link>
            </li>
            <li>
              <Link to="/categories/eletrica" className="hover:text-primary">
                Elétrica
              </Link>
            </li>
            <li>
              <Link to="/promocoes" className="text-red-500 hover:text-red-600">
                🔥 Promoções
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
