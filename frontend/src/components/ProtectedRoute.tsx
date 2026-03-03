import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * 🔒 COMPONENTE: ProtectedRoute
 *
 * Protege rotas que requerem autenticação e/ou permissão admin.
 *
 * @param children - Componente filho a ser renderizado se autorizado
 * @param requireAdmin - Se true, requer role "admin"
 *
 * FLUXO:
 * 1. Verifica se usuário está logado
 * 2. Se requireAdmin=true, verifica se role="admin"
 * 3. Redireciona para login se não autorizado
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user } = useAuthStore();

  // 1️⃣ Usuário não está logado
  if (!user) {
    console.log("❌ Acesso negado: usuário não autenticado");
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Rota requer admin mas usuário não é admin
  if (requireAdmin && user.role !== "admin") {
    console.log("❌ Acesso negado: usuário não é admin");
    console.log("   User role:", user.role);
    return <Navigate to="/" replace />;
  }

  // ✅ Usuário autorizado
  console.log("✅ Acesso permitido:", user.email, `(${user.role})`);
  return <>{children}</>;
}
