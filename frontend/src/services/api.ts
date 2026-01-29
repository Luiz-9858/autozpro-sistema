import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ========================================
// 🔐 AUTH SERVICES
// ========================================

export const authService = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// ========================================
// 📦 PRODUCT SERVICES
// ========================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: PaginationData;
  };
}

export const productService = {
  getAll: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<ProductsResponse> => {
    console.log(`🔍 Buscando produtos - Página ${page}, Limite ${limit}`); // Debug
    const response = await api.get(`/api/products?page=${page}&limit=${limit}`);
    console.log("📦 Resposta da API:", response.data); // Debug
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  create: async (data: Partial<Product>) => {
    const response = await api.post("/api/products", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>) => {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },
};

// ========================================
// 🛒 CATEGORY SERVICES
// ========================================

export const categoryService = {
  getAll: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },
};

export default api;
