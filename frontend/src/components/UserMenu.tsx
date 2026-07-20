import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    toast.success("Desconectado com sucesso!");
    navigate("/login");
  };

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  if (!user || user.role === "admin") {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão de Usuário */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex flex-col items-center text-gray-700 hover:text-primary transition-colors group"
        title={`${user.name} - ${user.email}`}
      >
        <div className="relative">
          <i className="fas fa-user text-xl mb-1"></i>
          {isOpen && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          )}
        </div>
        <span className="text-xs hidden lg:block">
          {user.name.split(" ")[0]}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-100">
          {/* Header do Menu */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>

          {/* Itens do Menu */}
          <div className="py-2">
            {/* Meu Perfil */}
            <Link
              to="#"
              onClick={() => {
                handleMenuItemClick();
                toast("Meu Perfil - Em breve!");
              }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-gray-700 hover:text-primary text-sm disabled:opacity-50"
            >
              <i className="fas fa-user-circle w-4 text-center"></i>
              <span>Meu Perfil</span>
            </Link>

            {/* Meus Pedidos */}
            <Link
              to="/my-orders"
              onClick={handleMenuItemClick}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-gray-700 hover:text-primary text-sm"
            >
              <i className="fas fa-box w-4 text-center"></i>
              <span>Meus Pedidos</span>
            </Link>

            {/* Favoritos */}
            <Link
              to="#"
              onClick={() => {
                handleMenuItemClick();
                toast("Favoritos - Em breve!");
              }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-gray-700 hover:text-primary text-sm disabled:opacity-50"
            >
              <i className="fas fa-heart w-4 text-center"></i>
              <span>Favoritos</span>
            </Link>

            {/* Endereços */}
            <Link
              to="#"
              onClick={() => {
                handleMenuItemClick();
                toast("Endereços - Em breve!");
              }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-gray-700 hover:text-primary text-sm disabled:opacity-50"
            >
              <i className="fas fa-map-marker-alt w-4 text-center"></i>
              <span>Endereços</span>
            </Link>

            {/* Configurações */}
            <Link
              to="#"
              onClick={() => {
                handleMenuItemClick();
                toast("Configurações - Em breve!");
              }}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition text-gray-700 hover:text-primary text-sm disabled:opacity-50"
            >
              <i className="fas fa-cog w-4 text-center"></i>
              <span>Configurações</span>
            </Link>
          </div>

          {/* Divisor */}
          <div className="border-t"></div>

          {/* Logout */}
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-red-600 hover:text-red-800 text-sm font-medium"
            >
              <i className="fas fa-sign-out-alt w-4 text-center"></i>
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu Mobile - Dentro do Sidebar (será tratado separadamente) */}
    </div>
  );
}
