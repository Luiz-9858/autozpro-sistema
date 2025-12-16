export interface User {
  id: string;
  email: string;
  nome: string;
  cpf: string;
  telefone: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nome: string;
  cpf: string;
  telefone: string;
}
