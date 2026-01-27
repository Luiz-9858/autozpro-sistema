import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Criar instância do axios com configurações padrão
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (não autorizado), limpar token e redirecionar
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// =========================================
// 🔐 AUTENTICAÇÃO
// ==========================================

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export const authService = {
  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  // Registro
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  // Obter usuário atual
  me: async (): Promise<AuthResponse["user"]> => {
    const response = await api.get<AuthResponse["user"]>("/auth/me");
    return response.data;
  },

  // Logout (apenas limpa dados locais)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// ==========================================
// 📦 PRODUTOS (placeholder para próximos passos)
// ==========================================

export const productService = {
  // ✅ ATUALIZADO: Aceita page e limit como parâmetros
  getAll: async (page: number = 1, limit: number = 20) => {
    const response = await api.get(`/api/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },
};

export default api;
