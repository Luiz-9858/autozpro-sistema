import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import Cart from "./pages/Cart";

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// ========================================
// 🔒 COMPONENTE: AdminRoute
// ========================================
function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  // Esperar o auth carregar antes de verificar
  useEffect(() => {
    // Dar tempo para o checkAuth() do App.tsx executar
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 🔄 Ainda verificando autenticação
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ❌ Não autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Não é admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ É admin
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

      {/* 🛒 ROTA DO CARRINHO (NOVO) */}
      <Route
        path="/cart"
        element={
          <PublicLayout>
            <Cart />
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
