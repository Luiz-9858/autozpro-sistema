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
import ProductFormPage from "./pages/ProductFormPage";

// ========================================
// 🔒 COMPONENTE: ProtectedRoute
// ========================================
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  console.log("🔒 ProtectedRoute - User:", user);

  if (!user) {
    console.log("❌ Redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// ========================================
// 🔒 COMPONENTE: AdminRoute
// ========================================
function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  console.log("👑 AdminRoute - Verificando acesso admin...");
  console.log("   User:", user);
  console.log("   Role:", user?.role);

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

// ========================================
// 🌐 LAYOUT PADRÃO (COM HEADER + FOOTER)
// ========================================
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ========================================
          🌐 ROTAS PÚBLICAS (COM HEADER + FOOTER)
          ======================================== */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />
      <Route
        path="/products"
        element={
          <PublicLayout>
            <Products />
          </PublicLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PublicLayout>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </PublicLayout>
        }
      />

      {/* ========================================
          👑 ROTAS ADMIN (SEM HEADER + FOOTER)
          ======================================== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/edit/:id" element={<ProductFormPage />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  );
}
