import { create } from "zustand";
import {
  authService,
  type LoginData,
  type RegisterData,
} from "../services/api";
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
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
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
  login: async (data: LoginData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.login(data);

      // Salvar no localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Atualizar store
      set({
        user: response.user,
        token: response.token,
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
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await authService.register(data);

      // Salvar no localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Atualizar store
      set({
        user: response.user,
        token: response.token,
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
    authService.logout();
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

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
        });
        console.log("✅ Usuário autenticado:", user.name);
      } catch (error) {
        console.error("❌ Erro ao recuperar autenticação:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },

  // 🧹 LIMPAR ERRO
  clearError: () => set({ error: null }),
}));
