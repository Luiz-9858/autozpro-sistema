// Tipos de Usuário
export interface User {
  id: string;
  email: string;
  nome: string;
  cpf: string;
  telefone: string;
  createdAt: string;
}

// Resposta de autenticação
export interface AuthResponse {
  token: string;
  user: User;
}

// Dados de login
export interface LoginData {
  email: string;
  password: string;
}

// Dados de registro
export interface RegisterData {
  email: string;
  password: string;
  nome: string;
  cpf: string;
  telefone: string;
}

// Produto
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null; // ✅ NOVO: Preço promocional
  imageUrl: string | null;
  category: string;
  categoryId: string; // ✅ NOVO: ID da categoria
  stock: number;
  sku: string; // ✅ NOVO: Código do produto
  isActive: boolean; // ✅ NOVO: Se está ativo
  rating?: number;
  reviews?: number;
}

// Categoria
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount: number;
}

// Item do carrinho (estrutura otimizada)
export interface CartItem {
  id: string; // ID do produto
  name: string;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  quantity: number;
  stock: number; // Para validar quantidade máxima
}

// Erro de API
export interface ApiError {
  message: string;
  status: number;
}
