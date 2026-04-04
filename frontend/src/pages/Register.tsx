import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Se já estiver logado, redirecionar para dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Limpar erro ao desmontar componente
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erros ao digitar
    if (error) clearError();
    if (passwordError) setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de senha
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Validação básica
    if (!formData.name || !formData.email || !formData.password) {
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      // Redirecionar para dashboard após sucesso
      navigate("/dashboard");
    } catch {
      // Erro já é tratado na store
      console.log("Erro capturado no componente");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
            <span className="text-primary">B77 Auto Parts</span>
          </div>
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
          Crie sua conta gratuita
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
          Ou{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-red-700"
          >
            entre na sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow sm:rounded-lg sm:py-8 sm:px-10">
          {/* Mensagem de Erro */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 sm:px-4 sm:py-3 rounded relative text-sm">
              <span className="block sm:inline pr-8">{error}</span>
              <button
                onClick={clearError}
                className="absolute top-0 bottom-0 right-0 px-3 sm:px-4 py-2.5 sm:py-3"
                aria-label="Fechar"
              >
                <span className="text-xl sm:text-2xl">&times;</span>
              </button>
            </div>
          )}

          {/* Erro de Senha */}
          {passwordError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 sm:px-4 sm:py-3 rounded relative text-sm">
              <span className="block sm:inline pr-8">{passwordError}</span>
              <button
                onClick={() => setPasswordError("")}
                className="absolute top-0 bottom-0 right-0 px-3 sm:px-4 py-2.5 sm:py-3"
                aria-label="Fechar"
              >
                <span className="text-xl sm:text-2xl">&times;</span>
              </button>
            </div>
          )}

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {/* Nome Completo */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome Completo
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm sm:text-base"
                  placeholder="João Silva"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm sm:text-base"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Telefone (Opcional) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Telefone (Opcional)
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm sm:text-base"
                  placeholder="(11) 98765-4321"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm sm:text-base"
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
                  disabled={isLoading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Senha
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-sm sm:text-base"
                  placeholder="Digite a senha novamente"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Termos de Uso */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-0.5 text-primary focus:ring-primary border-gray-300 rounded flex-shrink-0"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-xs sm:text-sm text-gray-900"
              >
                Eu aceito os{" "}
                <a href="#" className="text-primary hover:text-red-700">
                  termos de uso
                </a>{" "}
                e{" "}
                <a href="#" className="text-primary hover:text-red-700">
                  política de privacidade
                </a>
              </label>
            </div>

            {/* Botão de Cadastrar */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Criando conta...
                  </span>
                ) : (
                  "Criar conta"
                )}
              </button>
            </div>
          </form>

          {/* Link para Login */}
          <div className="mt-5 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Já tem uma conta?
                </span>
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Entrar na minha conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
