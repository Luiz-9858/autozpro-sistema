import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, CartItem } from "../types/index";

/**
 * 🛒 STORE: Carrinho de Compras
 *
 * Gerencia itens do carrinho com persistência no localStorage.
 * Sincroniza stock e preços automaticamente.
 */

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string, maxStock: number) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  syncItemWithProduct: (product: Product) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ========================================
      // 📦 ESTADO INICIAL
      // ========================================
      items: [],

      // ========================================
      // 🔄 SINCRONIZAR ITEM COM PRODUTO
      // ========================================
      syncItemWithProduct: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // Atualiza dados do produto (stock, preço, etc)
          set({
            items: items.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    stock: product.stock,
                    price: product.price,
                    salePrice: product.salePrice,
                    imageUrl: product.imageUrl,
                    name: product.name,
                  }
                : item,
            ),
          });
        }
      },

      // ========================================
      // ➕ ADICIONAR ITEM
      // ========================================
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        // Validar estoque disponível
        if (product.stock <= 0) {
          console.warn(`Produto fora de estoque: ${product.name}`);
          return;
        }

        if (existingItem) {
          // Produto já está no carrinho
          // Sincronizar dados primeiro
          get().syncItemWithProduct(product);

          // Verificar se pode adicionar mais
          if (existingItem.quantity >= product.stock) {
            console.warn(`Estoque máximo atingido: ${product.name}`);
            return;
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

        if (!item) return;

        // Quantidade zero ou negativa = remover
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        // Validar estoque máximo
        if (quantity > item.stock) {
          console.warn(`Quantidade máxima: ${item.stock}`);
          return;
        }

        // Atualiza quantidade
        set({
          items: items.map((i) =>
            i.id === productId ? { ...i, quantity } : i,
          ),
        });
      },

      // ========================================
      // ➕ INCREMENTAR QUANTIDADE
      // ========================================
      incrementQuantity: (productId, maxStock) => {
        const items = get().items;
        const item = items.find((i) => i.id === productId);

        if (!item) return;

        if (item.quantity >= maxStock) {
          console.warn(`Quantidade máxima: ${maxStock}`);
          return;
        }

        set({
          items: items.map((i) =>
            i.id === productId
              ? { ...i, quantity: i.quantity + 1, stock: maxStock }
              : i,
          ),
        });
      },

      // ========================================
      // ➖ DECREMENTAR QUANTIDADE
      // ========================================
      decrementQuantity: (productId) => {
        const items = get().items;
        const item = items.find((i) => i.id === productId);

        if (!item) return;

        if (item.quantity <= 1) {
          // Se for o último, perguntar se remove
          return;
        }

        set({
          items: items.map((i) =>
            i.id === productId ? { ...i, quantity: i.quantity - 1 } : i,
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
      name: "cart-storage",
      version: 3, // ✅ VERSÃO 3: Sincronização automática
    },
  ),
);
