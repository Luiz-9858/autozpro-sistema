import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { useAuthStore } from "./store/authStore";
import Header from "./components/layout/Header";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Verificar autenticação ao carregar o app
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Header />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
