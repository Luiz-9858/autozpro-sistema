import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import CartItem from "../components/CartItem";

/**
 * 🛒 PÁGINA: Carrinho de Compras
 *
 * Exibe itens do carrinho, permite alterar quantidades,
 * mostra resumo e botão para finalizar compra.
 */

export default function Cart() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Handler para limpar carrinho
  const handleClearCart = () => {
    if (
      confirm(
        `Tem certeza que deseja remover todos os ${totalItems} ${totalItems === 1 ? "item" : "itens"} do carrinho?`,
      )
    ) {
      clearCart();
    }
  };

  // Carrinho vazio
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-600 mb-8">
              Adicione produtos ao carrinho para continuar comprando
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Carrinho de Compras
            </h1>
            <p className="text-gray-600 mt-1">
              {totalItems} {totalItems === 1 ? "item" : "itens"} no carrinho
            </p>
          </div>

          <Link
            to="/products"
            className="text-primary hover:text-red-700 font-semibold"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Continuar Comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de itens */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Botão limpar carrinho */}
            <button
              onClick={handleClearCart}
              className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              <i className="fas fa-trash mr-2"></i>
              Limpar Carrinho
            </button>
          </div>

          {/* Resumo do pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} itens)</span>
                  <span className="font-semibold">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="font-semibold text-green-600">
                    {totalPrice >= 299 ? "Grátis" : "A calcular"}
                  </span>
                </div>

                {totalPrice < 299 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                    <i className="fas fa-info-circle mr-2"></i>
                    Falta R$ {(299 - totalPrice).toFixed(2)} para frete grátis!
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary">
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botão finalizar compra */}
              <button
                className="w-full bg-primary text-white px-6 py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg shadow-lg"
                aria-label="Finalizar compra"
              >
                <i className="fas fa-check-circle mr-2"></i>
                Finalizar Compra
              </button>

              {/* Selos de segurança */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 text-center mb-3">
                  Compra 100% segura
                </p>
                <div className="flex justify-center gap-4 text-gray-400">
                  <i className="fas fa-lock text-2xl" title="Compra segura"></i>
                  <i
                    className="fas fa-shield-alt text-2xl"
                    title="Proteção ao comprador"
                  ></i>
                  <i
                    className="fas fa-credit-card text-2xl"
                    title="Pagamento seguro"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
