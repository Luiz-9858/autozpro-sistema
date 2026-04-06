import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Links do menu
  const menuItems = [
    {
      path: "/admin",
      icon: "fa-chart-line",
      label: "Dashboard",
      exact: true,
    },
    {
      path: "/admin/products",
      icon: "fa-box",
      label: "Produtos",
    },
    {
      path: "/admin/categories",
      icon: "fa-folder",
      label: "Categorias",
    },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleMenuClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Botão Hamburguer - Mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-700 hover:text-primary transition"
              aria-label="Abrir menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>

            <Link
              to="/"
              className="text-primary hover:text-primary-dark transition"
            >
              <i className="fas fa-home text-lg md:text-xl"></i>
            </Link>
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">
              Painel <span className="text-primary">Admin</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Info User - Desktop */}
            <div className="hidden sm:block text-right">
              <p className="text-xs md:text-sm font-medium text-gray-900">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            {/* Botão Logout */}
            <button
              onClick={handleLogout}
              className="px-3 md:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 md:gap-2 text-sm md:text-base"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative flex">
        {/* Overlay - Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static top-0 left-0 h-full
            w-64 bg-white shadow-lg lg:shadow-sm
            transform transition-transform duration-300 ease-in-out
            z-50 lg:z-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            min-h-[calc(100vh-73px)] lg:min-h-[calc(100vh-73px)]
            overflow-y-auto
          `}
        >
          {/* Header Sidebar - Mobile */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fechar menu"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path, item.exact)
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <i className={`fas ${item.icon} text-lg`}></i>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info - Mobile */}
          <div className="sm:hidden p-4 border-t border-gray-200 mt-4">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full lg:w-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
