import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

/**
 * 🛒 COMPONENTE: CartBadge
 *
 * Ícone do carrinho com badge mostrando quantidade de itens.
 * Usado no header/navbar.
 */

interface CartBadgeProps {
  showLabel?: boolean;
  className?: string;
}

export default function CartBadge({
  showLabel = false,
  className = "",
}: CartBadgeProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Link
      to="/cart"
      className={`relative flex items-center gap-2 text-gray-700 hover:text-primary transition ${className}`}
      aria-label={`Carrinho com ${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
    >
      {/* Ícone do carrinho */}
      <div className="relative">
        <i className="fas fa-shopping-cart text-xl"></i>

        {/* Badge com quantidade */}
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>

      {/* Label opcional */}
      {showLabel && (
        <span className="hidden md:inline font-medium">
          Carrinho
          {totalItems > 0 && (
            <span className="ml-1 text-primary">({totalItems})</span>
          )}
        </span>
      )}
    </Link>
  );
}
