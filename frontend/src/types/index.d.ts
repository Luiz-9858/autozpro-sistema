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
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

// Categoria
export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

// Item do carrinho
export interface CartItem {
  product: Product;
  quantity: number;
}

// Erro de API
export interface ApiError {
  message: string;
  status: number;
}
