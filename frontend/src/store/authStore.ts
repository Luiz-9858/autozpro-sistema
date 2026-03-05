import { create } from "zustand";
import { authService } from "../services/api";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Ações
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // 🔐 LOGIN
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login({ email, password });

      console.log("📦 Resposta do login:", response);

      // Verificar se a resposta tem a estrutura correta
      if (!response.data?.token || !response.data?.user) {
        throw new Error("Resposta inválida do servidor");
      }

      // Salvar no localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("💾 Token salvo:", response.data.token);
      console.log("👤 User salvo:", response.data.user);

      // Atualizar store
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        error: null,
      });

      console.log("✅ Login realizado com sucesso!");
    } catch (error) {
      let errorMessage = "Erro ao fazer login";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
      console.error("❌ Erro no login:", errorMessage);
      throw error;
    }
  },

  // 📝 REGISTRO
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.register({ name, email, password });

      console.log("📦 Resposta do registro:", response);

      // Verificar se a resposta tem a estrutura correta
      if (!response.data?.token || !response.data?.user) {
        throw new Error("Resposta inválida do servidor");
      }

      // Salvar no localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Atualizar store
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        error: null,
      });

      console.log("✅ Registro realizado com sucesso!");
    } catch (error) {
      let errorMessage = "Erro ao fazer registro";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
      console.error("❌ Erro no registro:", errorMessage);
      throw error;
    }
  },

  // 🚪 LOGOUT
  logout: () => {
    // Remover do localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Limpar store
    set({
      user: null,
      token: null,
      error: null,
    });

    console.log("✅ Logout realizado com sucesso!");
  },

  // 🔍 VERIFICAR AUTENTICAÇÃO (ao carregar app)
  checkAuth: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    console.log("🔍 Verificando autenticação...");
    console.log("   Token:", token ? "existe" : "não existe");
    console.log("   User:", userStr ? "existe" : "não existe");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
        });
        console.log("✅ Usuário autenticado:", user.name, `(${user.role})`);
      } catch (error) {
        console.error("❌ Erro ao recuperar autenticação:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      console.log("ℹ️  Nenhum usuário autenticado");
    }
  },

  // 🧹 LIMPAR ERRO
  clearError: () => set({ error: null }),
}));
