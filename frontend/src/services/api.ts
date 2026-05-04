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
    filters?: {
      categoryId: string | null;
      search: string | null;
    };
  };
}

export const productService = {
  getAll: async (
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    search?: string,
    vehicleId?: string, // ← ADICIONAR ESTE PARÂMETRO
  ): Promise<ProductsResponse> => {
    let url = `/api/products?page=${page}&limit=${limit}`;

    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (vehicleId) {
      // ← ADICIONAR ESTE BLOCO
      url += `&vehicleId=${vehicleId}`;
    }

    const response = await api.get(url);
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
// 📂 CATEGORY SERVICES
// ========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export const categoryService = {
  getAll: async (): Promise<CategoriesResponse> => {
    const response = await api.get("/api/categories");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/api/categories/slug/${slug}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    slug: string;
    description?: string;
  }) => {
    const response = await api.post("/api/categories", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<{ name: string; slug: string; description: string }>,
  ) => {
    const response = await api.put(`/api/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },
};

// ========================================
// 👑 ADMIN SERVICES
// ========================================

export interface DashboardStats {
  overview: {
    totalProducts: number;
    totalCategories: number;
    activeProducts: number;
    inactiveProducts: number;
    lowStockProducts: number;
    totalStock: number;
  };
  productsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    price: number;
    category: {
      name: string;
    };
  }>;
}

export const adminService = {
  getStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    const response = await api.get("/api/admin/stats");
    return response.data;
  },

  getLowStockProducts: async () => {
    const response = await api.get("/api/admin/low-stock");
    return response.data;
  },
};

// ========================================
// 📸 BULK SERVICES (NOVO)
// ========================================

export interface BulkImageUpdate {
  sku: string;
  imageUrl: string;
}

export interface BulkUpdateResult {
  sku: string;
  status: "success" | "error" | "not_found";
  message: string;
}

export interface BulkUpdateResponse {
  success: boolean;
  summary: {
    total: number;
    success: number;
    notFound: number;
    errors: number;
  };
  results: BulkUpdateResult[];
}

export const bulkService = {
  updateImages: async (
    updates: BulkImageUpdate[],
  ): Promise<BulkUpdateResponse> => {
    const response = await api.post("/api/bulk/images", { updates });
    return response.data;
  },

  getProductsWithoutImages: async () => {
    const response = await api.get("/api/bulk/products-without-images");
    return response.data;
  },
};

export default api;
