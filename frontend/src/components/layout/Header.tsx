import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useState, useEffect } from "react";
import { categoryService } from "../../services/api";
import type { Category } from "../../services/api";

export default function Header() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?categoryId=${categoryId}`);
  };

  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Barra superior vermelha */}
      <div className="bg-primary text-white">
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
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.png" alt="B77 Auto Parts" className="h-12" />
          </Link>

          {/* Busca */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
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
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <i className="fas fa-user text-xl mb-1"></i>
                  <span className="text-xs">Minha Conta</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <i className="fas fa-sign-out-alt text-xl mb-1"></i>
                  <span className="text-xs">Sair</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
              >
                <i className="fas fa-user text-xl mb-1"></i>
                <span className="text-xs">Entrar</span>
              </Link>
            )}

            <Link
              to="/favorites"
              className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
            >
              <i className="fas fa-heart text-xl mb-1"></i>
              <span className="text-xs">Favoritos</span>
            </Link>

            <Link
              to="/cart"
              className="flex flex-col items-center text-gray-700 hover:text-primary transition-colors relative"
            >
              <i className="fas fa-shopping-cart text-xl mb-1"></i>
              <span className="text-xs">Carrinho</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Menu de categorias */}
      <nav className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 py-3">
            <Link
              to="/products"
              className="flex items-center gap-2 font-semibold hover:text-primary-light transition-colors"
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
            >
              <i className="fas fa-tag"></i>
              Promoções
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
