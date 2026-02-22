import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Layouts
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AdminLayout from "./components/layout/AdminLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";

// ========================================
// 🔒 COMPONENTE: ProtectedRoute
// ========================================
/**
 * Protege rotas que requerem autenticação
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// ========================================
// 🔒 COMPONENTE: AdminRoute
// ========================================
/**
 * Protege rotas que requerem permissão admin
 */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  // Não autenticado
  if (!user) {
    console.log("❌ Acesso negado: usuário não autenticado");
    return <Navigate to="/login" replace />;
  }

  // Não é admin
  if (user.role !== "admin") {
    console.log("❌ Acesso negado: usuário não é admin");
    console.log("   User role:", user.role);
    alert("Acesso negado. Apenas administradores podem acessar esta área.");
    return <Navigate to="/" replace />;
  }

  // ✅ É admin
  console.log("✅ Acesso admin permitido:", user.email);
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ========================================
          🌐 ROTAS PÚBLICAS (COM HEADER + FOOTER)
          ======================================== */}
      <Route
        path="/*"
        element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />

              {/* Rota protegida (usuário logado) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </>
        }
      />

      {/* ========================================
          👑 ROTAS ADMIN (SEM HEADER + FOOTER)
          ======================================== */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* Rotas aninhadas dentro do AdminLayout */}
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  );
}
