import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem } from "../types/index";

/**
 * 🛒 STORE: Carrinho de Compras
 *
 * Gerencia itens do carrinho com persistência no localStorage.
 * Validações: estoque, preço promocional, duplicatas.
 */

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ========================================
      // 📦 ESTADO INICIAL
      // ========================================
      items: [],

      // ========================================
      // ➕ ADICIONAR ITEM
      // ========================================
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        // Produto já está no carrinho
        if (existingItem) {
          // Validar estoque antes de aumentar
          if (existingItem.quantity >= product.stock) {
            console.warn(`Estoque insuficiente: ${product.name}`);
            return; // Não adiciona se atingiu estoque máximo
          }

          // Aumenta quantidade
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          // Produto novo no carrinho
          if (product.stock <= 0) {
            console.warn(`Produto fora de estoque: ${product.name}`);
            return; // Não adiciona se estoque zerado
          }

          // Adiciona item com dados essenciais (otimizado)
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice,
            imageUrl: product.imageUrl,
            stock: product.stock,
            quantity: 1,
          };

          set({ items: [...items, newItem] });
        }
      },

      // ========================================
      // ➖ REMOVER ITEM
      // ========================================
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      // ========================================
      // 🔄 ATUALIZAR QUANTIDADE
      // ========================================
      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === productId);

        // Item não existe no carrinho
        if (!item) return;

        // Quantidade zero ou negativa = remover
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        // Validar estoque máximo
        if (quantity > item.stock) {
          console.warn(`Quantidade máxima: ${item.stock}`);
          return; // Não permite mais que o estoque
        }

        // Atualiza quantidade
        set({
          items: items.map((i) =>
            i.id === productId ? { ...i, quantity } : i,
          ),
        });
      },

      // ========================================
      // 🗑️ LIMPAR CARRINHO
      // ========================================
      clearCart: () => {
        set({ items: [] });
      },

      // ========================================
      // 💰 TOTAL DO CARRINHO
      // ========================================
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          // Usa preço promocional se existir, senão usa preço normal
          const price = item.salePrice ?? item.price;
          return total + price * item.quantity;
        }, 0);
      },

      // ========================================
      // 📊 TOTAL DE ITENS
      // ========================================
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // ========================================
      // 🔢 QUANTIDADE DE UM ITEM
      // ========================================
      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.id === productId);
        return item ? item.quantity : 0;
      },

      // ========================================
      // ✅ VERIFICAR SE ESTÁ NO CARRINHO
      // ========================================
      isInCart: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: "cart-storage", // Nome no localStorage
      version: 2, // ✅ ATUALIZADO: Versão 2 (nova estrutura)
    },
  ),
);
