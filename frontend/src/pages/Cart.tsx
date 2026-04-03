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
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
            <div className="text-4xl md:text-6xl mb-4">🛒</div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Seu carrinho está vazio
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
              Adicione produtos ao carrinho para continuar comprando
            </p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-6 md:px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold text-sm md:text-base"
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
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 pb-32 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Carrinho de Compras
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {totalItems} {totalItems === 1 ? "item" : "itens"} no carrinho
            </p>
          </div>

          <Link
            to="/products"
            className="text-primary hover:text-red-700 font-semibold text-sm md:text-base inline-flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Continuar Comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Lista de itens */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            {/* Botão limpar carrinho - APENAS DESKTOP */}
            <button
              onClick={handleClearCart}
              className="hidden lg:flex w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition font-semibold justify-center items-center"
            >
              <i className="fas fa-trash mr-2"></i>
              Limpar Carrinho
            </button>
          </div>

          {/* Resumo do pedido - DESKTOP (Sticky Sidebar) */}
          <div className="hidden lg:block lg:col-span-1">
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

      {/* Resumo Fixo Mobile - APENAS MOBILE/TABLET */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Resumo Compacto */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-600">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </p>
              <p className="text-lg font-bold text-gray-900">
                R$ {totalPrice.toFixed(2)}
              </p>
            </div>

            {/* Frete Badge */}
            <div className="text-xs">
              {totalPrice >= 299 ? (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                  <i className="fas fa-truck mr-1"></i>
                  Frete Grátis
                </span>
              ) : (
                <span className="text-gray-600">
                  Falta R$ {(299 - totalPrice).toFixed(2)} p/ frete grátis
                </span>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            <button
              onClick={handleClearCart}
              className="flex-shrink-0 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition"
              aria-label="Limpar carrinho"
            >
              <i className="fas fa-trash"></i>
            </button>

            <button
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-bold shadow-lg"
              aria-label="Finalizar compra"
            >
              <i className="fas fa-check-circle mr-2"></i>
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
