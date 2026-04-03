import { useCartStore } from "../store/cartStore";
import type { CartItem as CartItemType } from "../types/index";

/**
 * 🛒 COMPONENTE: CartItem
 *
 * Card individual de produto no carrinho.
 * Permite alterar quantidade e remover item.
 */

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const price = item.salePrice ?? item.price;
  const subtotal = price * item.quantity;

  // Handlers
  const handleIncrement = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= item.stock) {
      updateQuantity(item.id, value);
    }
  };

  const handleRemove = () => {
    if (confirm(`Remover "${item.name}" do carrinho?`)) {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition">
      {/* Imagem + Info Principal (Lado a Lado no Mobile) */}
      <div className="flex gap-3 flex-1">
        {/* Imagem */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
          <img
            src={
              item.imageUrl ||
              "https://placehold.co/200x200/F3F4F6/9CA3AF?text=Sem+Imagem"
            }
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Informações */}
        <div className="flex-1 min-w-0">
          {/* Nome - Truncado */}
          <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base line-clamp-2">
            {item.name}
          </h3>

          {/* Preço unitário */}
          <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2 md:mb-3">
            {item.salePrice ? (
              <>
                <span className="text-xs md:text-sm text-gray-500 line-through">
                  R$ {item.price.toFixed(2)}
                </span>
                <span className="text-base md:text-lg font-bold text-primary">
                  R$ {item.salePrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base md:text-lg font-bold text-gray-900">
                R$ {item.price.toFixed(2)}
              </span>
            )}
            <span className="text-xs md:text-sm text-gray-500">/ un</span>
          </div>

          {/* Estoque - Mobile */}
          <p className="text-xs text-gray-500 sm:hidden mb-2">
            {item.stock} disponíveis
          </p>
        </div>
      </div>

      {/* Controles e Subtotal */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Controles de quantidade */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={handleDecrement}
              className="px-2.5 md:px-3 py-1.5 md:py-2 hover:bg-gray-100 transition"
              aria-label="Diminuir quantidade"
            >
              <i className="fas fa-minus text-xs"></i>
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={handleQuantityChange}
              min="1"
              max={item.stock}
              className="w-10 md:w-12 text-center border-x border-gray-300 py-1.5 md:py-2 focus:outline-none text-sm"
              aria-label="Quantidade"
            />
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.stock}
              className="px-2.5 md:px-3 py-1.5 md:py-2 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Aumentar quantidade"
            >
              <i className="fas fa-plus text-xs"></i>
            </button>
          </div>

          {/* Estoque - Desktop */}
          <span className="hidden sm:block text-xs md:text-sm text-gray-500 whitespace-nowrap">
            {item.stock} disp.
          </span>

          {/* Botão Remover - Mobile (Ícone) */}
          <button
            onClick={handleRemove}
            className="sm:hidden text-red-600 hover:text-red-800 transition px-2"
            aria-label={`Remover ${item.name}`}
          >
            <i className="fas fa-trash text-lg"></i>
          </button>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
            <p className="text-lg md:text-xl font-bold text-gray-900">
              R$ {subtotal.toFixed(2)}
            </p>
          </div>

          {/* Botão Remover - Desktop (Com Texto) */}
          <button
            onClick={handleRemove}
            className="hidden sm:block text-red-600 hover:text-red-800 transition text-sm whitespace-nowrap"
            aria-label={`Remover ${item.name}`}
          >
            <i className="fas fa-trash mr-1"></i>
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
