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
    <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition">
      {/* Imagem */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
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
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>

        {/* Preço unitário */}
        <div className="flex items-center gap-2 mb-3">
          {item.salePrice ? (
            <>
              <span className="text-sm text-gray-500 line-through">
                R$ {item.price.toFixed(2)}
              </span>
              <span className="text-lg font-bold text-primary">
                R$ {item.salePrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              R$ {item.price.toFixed(2)}
            </span>
          )}
          <span className="text-sm text-gray-500">por unidade</span>
        </div>

        {/* Controles de quantidade */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={handleDecrement}
              className="px-3 py-1 hover:bg-gray-100 transition"
              aria-label="Diminuir quantidade"
            >
              <i className="fas fa-minus text-sm"></i>
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={handleQuantityChange}
              min="1"
              max={item.stock}
              className="w-16 text-center border-x border-gray-300 py-1 focus:outline-none"
              aria-label="Quantidade"
            />
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.stock}
              className="px-3 py-1 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Aumentar quantidade"
            >
              <i className="fas fa-plus text-sm"></i>
            </button>
          </div>

          {/* Estoque disponível */}
          <span className="text-sm text-gray-500">
            {item.stock} disponíveis
          </span>

          {/* Botão remover */}
          <button
            onClick={handleRemove}
            className="ml-auto text-red-600 hover:text-red-800 transition"
            aria-label={`Remover ${item.name} do carrinho`}
          >
            <i className="fas fa-trash mr-2"></i>
            Remover
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="text-sm text-gray-500 mb-1">Subtotal</p>
        <p className="text-2xl font-bold text-gray-900">
          R$ {subtotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
