import { useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../types/index";

/**
 * 🛒 COMPONENTE: AddToCartButton
 *
 * Botão para adicionar produto ao carrinho.
 * Mostra feedback visual e valida estoque.
 */

interface AddToCartButtonProps {
  product: Product;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  showIcon?: boolean;
}

export default function AddToCartButton({
  product,
  variant = "primary",
  size = "md",
  fullWidth = false,
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem, getItemQuantity, isInCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const quantityInCart = getItemQuantity(product.id);
  const isProductInCart = isInCart(product.id);
  const canAddMore = quantityInCart < product.stock;

  // Handler de adicionar ao carrinho
  const handleAddToCart = async () => {
    // Validar estoque
    if (product.stock <= 0) {
      toast.error("Produto fora de estoque");
      return;
    }

    if (!canAddMore) {
      toast.error(`Quantidade máxima: ${product.stock} unidades`);
      return;
    }

    // Adicionar com animação
    setIsAdding(true);

    try {
      addItem(product);

      if (isProductInCart) {
        toast.success(`Quantidade atualizada! (${quantityInCart + 1})`);
      } else {
        toast.success("Produto adicionado ao carrinho!");
      }
    } catch (error) {
      toast.error("Erro ao adicionar produto");
      console.error(error);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  // Classes CSS baseadas nas props
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-red-700 active:scale-95",
    secondary: "bg-secondary text-white hover:bg-blue-700 active:scale-95",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-95",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`;

  // Botão desabilitado se sem estoque
  const isDisabled = product.stock <= 0 || isAdding;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={buttonClasses}
      aria-label={`Adicionar ${product.name} ao carrinho`}
    >
      {isAdding ? (
        <>
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Adicionando...
        </>
      ) : product.stock <= 0 ? (
        <>
          {showIcon && <i className="fas fa-times-circle mr-2"></i>}
          Fora de Estoque
        </>
      ) : (
        <>
          {showIcon && <i className="fas fa-shopping-cart mr-2"></i>}
          {isProductInCart ? "Adicionar Mais" : "Adicionar ao Carrinho"}
        </>
      )}
    </button>
  );
}
