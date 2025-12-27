# Páginas - B77 Auto Parts Frontend

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Rotas](#estrutura-de-rotas)
- [Páginas Públicas](#páginas-públicas)
- [Páginas Autenticadas](#páginas-autenticadas)
- [Páginas Administrativas](#páginas-administrativas)
- [Proteção de Rotas](#proteção-de-rotas)
- [SEO e Meta Tags](#seo-e-meta-tags)
- [Lazy Loading](#lazy-loading)

---

## Visão Geral

As páginas do B77 Auto Parts são organizadas por domínio e nível de acesso, utilizando React Router v6 para navegação e proteção de rotas.

### Convenções

- **Nomenclatura**: PascalCase (ex: `ProductDetails.tsx`)
- **Estrutura**: Cada página em sua própria pasta
- **Responsabilidade**: Páginas orquestram componentes, não implementam lógica complexa
- **SEO**: Todas as páginas têm meta tags configuradas

---

## Estrutura de Rotas

### Configuração Principal

**Localização:** `src/routes/index.tsx`

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import Loading from "@/components/common/Loading";

// Lazy loading de páginas
const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Orders = lazy(() => import("@/pages/Orders"));
const OrderDetails = lazy(() => import("@/pages/OrderDetails"));
const Profile = lazy(() => import("@/pages/Profile"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Admin
const AdminDashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/Admin/Products"));
const AdminOrders = lazy(() => import("@/pages/Admin/Orders"));
const AdminUsers = lazy(() => import("@/pages/Admin/Users"));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          {/* Rotas públicas */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/produtos/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
          </Route>

          {/* Rotas autenticadas */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedidos" element={<Orders />} />
            <Route path="/pedidos/:id" element={<OrderDetails />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/enderecos" element={<Addresses />} />
          </Route>

          {/* Rotas administrativas */}
          <Route
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/produtos" element={<AdminProducts />} />
            <Route path="/admin/pedidos" element={<AdminOrders />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
```

### Mapa de Rotas

| Rota              | Componente     | Acesso      | Descrição             |
| ----------------- | -------------- | ----------- | --------------------- |
| `/`               | Home           | Público     | Página inicial        |
| `/produtos`       | Products       | Público     | Listagem de produtos  |
| `/produtos/:id`   | ProductDetails | Público     | Detalhes do produto   |
| `/login`          | Login          | Público     | Login                 |
| `/cadastro`       | Register       | Público     | Cadastro              |
| `/carrinho`       | Cart           | Autenticado | Carrinho de compras   |
| `/checkout`       | Checkout       | Autenticado | Finalização de compra |
| `/pedidos`        | Orders         | Autenticado | Histórico de pedidos  |
| `/pedidos/:id`    | OrderDetails   | Autenticado | Detalhes do pedido    |
| `/perfil`         | Profile        | Autenticado | Perfil do usuário     |
| `/enderecos`      | Addresses      | Autenticado | Gerenciar endereços   |
| `/admin`          | AdminDashboard | Admin       | Dashboard admin       |
| `/admin/produtos` | AdminProducts  | Admin       | Gerenciar produtos    |
| `/admin/pedidos`  | AdminOrders    | Admin       | Gerenciar pedidos     |
| `/admin/usuarios` | AdminUsers     | Admin       | Gerenciar usuários    |

---

## Páginas Públicas

### Home (`/`)

**Localização:** `src/pages/Home/Home.tsx`

**Objetivo:** Página inicial com destaques e categorias.

**Seções:**

- Hero/Banner principal
- Categorias em destaque
- Produtos em destaque
- Produtos mais vendidos
- Banners promocionais
- Newsletter

**Exemplo de Implementação:**

```typescript
import { useQuery } from "react-query";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCarousel from "@/components/products/ProductCarousel";
import Newsletter from "@/components/home/Newsletter";
import { fetchFeaturedProducts, fetchCategories } from "@/services/api";

function Home() {
  const { data: featuredProducts } = useQuery(
    "featured-products",
    fetchFeaturedProducts
  );
  const { data: categories } = useQuery("categories", fetchCategories);

  return (
    <div className="space-y-12">
      <Hero />

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Categorias</h2>
        <CategoryGrid categories={categories} />
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Produtos em Destaque</h2>
        <ProductCarousel products={featuredProducts} />
      </section>

      <Newsletter />
    </div>
  );
}

export default Home;
```

**SEO:**

- Title: "B77 Auto Parts - Auto Peças para Veículos Leves e Pesados"
- Description: "Encontre as melhores auto peças para seu veículo. Entrega rápida e preços competitivos."
- Keywords: "auto peças, peças automotivas, filtros, freios, suspensão"

---

### Products (`/produtos`)

**Localização:** `src/pages/Products/Products.tsx`

**Objetivo:** Listagem de produtos com filtros e busca.

**Funcionalidades:**

- Filtros por categoria, preço, tipo de veículo
- Busca por texto
- Ordenação (preço, nome, relevância)
- Paginação ou scroll infinito
- Layout grid/lista

**Exemplo de Implementação:**

```typescript
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import ProductFilters from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import ProductSort from "@/components/products/ProductSort";
import Pagination from "@/components/common/Pagination";
import { fetchProducts } from "@/services/api/products";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    categoria: searchParams.get("categoria") || "",
    busca: searchParams.get("busca") || "",
    page: Number(searchParams.get("page")) || 1,
    sort: searchParams.get("sort") || "relevancia",
  });

  const { data, isLoading } = useQuery(["products", filters], () =>
    fetchProducts(filters)
  );

  const handleFiltersChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
    setSearchParams(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Sidebar com filtros */}
        <aside className="w-64 hidden lg:block">
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Produtos {data?.total && `(${data.total})`}
            </h1>
            <ProductSort
              value={filters.sort}
              onChange={(sort) => handleFiltersChange({ sort })}
            />
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              <ProductGrid products={data.produtos} />
              <Pagination
                currentPage={filters.page}
                totalPages={data.pagination.total_pages}
                onPageChange={(page) => handleFiltersChange({ page })}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Products;
```

**Query Parameters:**

- `categoria`: ID da categoria
- `busca`: Termo de busca
- `page`: Página atual
- `sort`: Ordenação (relevancia, preco_asc, preco_desc, nome)
- `veiculo_tipo`: Tipo de veículo (leve, pesado)

**SEO Dinâmico:**

- Title: "Filtros de Óleo - AutozPro" (quando filtrado por categoria)
- Description: Baseada nos filtros aplicados

---

### ProductDetails (`/produtos/:id`)

**Localização:** `src/pages/ProductDetails/ProductDetails.tsx`

**Objetivo:** Detalhes completos do produto.

**Seções:**

- Galeria de imagens
- Informações do produto
- Especificações técnicas
- Produtos relacionados
- Breadcrumbs

**Exemplo de Implementação:**

```typescript
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import ProductDetails from "@/components/products/ProductDetails";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import ProductCarousel from "@/components/products/ProductCarousel";
import { useCart } from "@/hooks/useCart";
import { fetchProduct } from "@/services/api/products";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery(["product", id], () => fetchProduct(id), {
    onError: () => navigate("/produtos"),
  });

  const handleAddToCart = (quantity: number) => {
    addToCart(product.id, quantity);
    toast.success("Produto adicionado ao carrinho!");
  };

  if (isLoading) return <Loading fullScreen />;
  if (error) return <ErrorPage />;

  const breadcrumbs = [
    { label: "Início", href: "/" },
    { label: "Produtos", href: "/produtos" },
    {
      label: product.categoria.nome,
      href: `/produtos?categoria=${product.categoria_id}`,
    },
    { label: product.nome },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />

      <ProductDetails product={product} onAddToCart={handleAddToCart} />

      {product.related?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <ProductCarousel products={product.related} />
        </section>
      )}
    </div>
  );
}

export default ProductDetailsPage;
```

**SEO Dinâmico:**

- Title: "{Nome do Produto} - AutozPro"
- Description: Descrição do produto (primeiros 160 caracteres)
- Schema.org Product markup

---

### Login (`/login`)

**Localização:** `src/pages/Login/Login.tsx`

**Objetivo:** Página de autenticação.

**Funcionalidades:**

- Formulário de login
- Link para recuperação de senha
- Link para cadastro
- Login social (futuro)

**Exemplo de Implementação:**

```typescript
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.senha);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Email ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="seu@email.com"
          />

          <Input
            label="Senha"
            type="password"
            {...register("senha")}
            error={errors.senha?.message}
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Lembrar-me</span>
            </label>
            <Link
              to="/recuperar-senha"
              className="text-sm text-blue-600 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
```

---

### Register (`/cadastro`)

**Localização:** `src/pages/Register/Register.tsx`

**Objetivo:** Cadastro de novo usuário.

**Funcionalidades:**

- Formulário de cadastro
- Validação de campos
- Termos de uso
- Link para login

**Exemplo de Implementação:**

```typescript
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z
  .object({
    nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
    telefone: z
      .string()
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
    senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    confirmar_senha: z.string(),
  })
  .refine((data) => data.senha === data.confirmar_senha, {
    message: "As senhas não conferem",
    path: ["confirmar_senha"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptedTerms) {
      toast.error("Você precisa aceitar os termos de uso");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Erro ao realizar cadastro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Cadastro</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome Completo"
            {...register("nome")}
            error={errors.nome?.message}
            placeholder="João Silva"
          />

          <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="seu@email.com"
          />

          <Input
            label="CPF"
            {...register("cpf")}
            error={errors.cpf?.message}
            mask="999.999.999-99"
            placeholder="000.000.000-00"
          />

          <Input
            label="Telefone"
            {...register("telefone")}
            error={errors.telefone?.message}
            mask="(99) 99999-9999"
            placeholder="(00) 00000-0000"
          />

          <Input
            label="Senha"
            type="password"
            {...register("senha")}
            error={errors.senha?.message}
            placeholder="••••••••"
          />

          <Input
            label="Confirmar Senha"
            type="password"
            {...register("confirmar_senha")}
            error={errors.confirmar_senha?.message}
            placeholder="••••••••"
          />

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 mr-2"
            />
            <span className="text-sm text-gray-600">
              Aceito os{" "}
              <Link to="/termos" className="text-blue-600 hover:underline">
                termos de uso
              </Link>{" "}
              e a{" "}
              <Link to="/privacidade" className="text-blue-600 hover:underline">
                política de privacidade
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={!acceptedTerms}
          >
            Cadastrar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
```

---

## Páginas Autenticadas

### Cart (`/carrinho`)

**Localização:** `src/pages/Cart/Cart.tsx`

**Objetivo:** Visualizar e gerenciar carrinho de compras.

**Exemplo de Implementação:**

```typescript
import { Link } from "react-router-dom";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/common/Button";
import { useCart } from "@/hooks/useCart";

function Cart() {
  const { cart, totals, isLoading } = useCart();

  if (isLoading) return <Loading fullScreen />;

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
        <p className="text-gray-600 mb-8">
          Adicione produtos ao carrinho para continuar comprando
        </p>
        <Link to="/produtos">
          <Button variant="primary">Ver Produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList items={cart.items} />
        </div>

        <div>
          <CartSummary
            subtotal={totals.subtotal}
            frete={totals.frete}
            desconto={totals.desconto}
            total={totals.total}
            onCheckout={() => navigate("/checkout")}
          />
        </div>
      </div>
    </div>
  );
}

export default Cart;
```

---

### Checkout (`/checkout`)

**Localização:** `src/pages/Checkout/Checkout.tsx`

**Objetivo:** Finalização de compra em múltiplos passos.

**Passos:**

1. Endereço de entrega
2. Forma de pagamento
3. Revisão e confirmação

**Exemplo de Implementação:**

```typescript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import AddressStep from "@/components/checkout/AddressStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import ReviewStep from "@/components/checkout/ReviewStep";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/services/api/orders";

function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState({
    endereco_entrega_id: "",
    metodo_pagamento: "",
    observacoes: "",
  });

  const steps = [
    { number: 1, title: "Endereço", description: "Dados de entrega" },
    { number: 2, title: "Pagamento", description: "Forma de pagamento" },
    { number: 3, title: "Revisão", description: "Confirmar pedido" },
  ];

  const handleAddressSubmit = (endereco_entrega_id: string) => {
    setCheckoutData({ ...checkoutData, endereco_entrega_id });
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (metodo_pagamento: string) => {
    setCheckoutData({ ...checkoutData, metodo_pagamento });
    setCurrentStep(3);
  };

  const handleOrderSubmit = async (observacoes: string) => {
    try {
      const order = await createOrder({
        ...checkoutData,
        observacoes,
      });

      clearCart();
      toast.success("Pedido realizado com sucesso!");
      navigate(`/pedidos/${order.id}`);
    } catch (error) {
      toast.error("Erro ao criar pedido");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <CheckoutSteps currentStep={currentStep} steps={steps} />

      <div className="mt-8">
        {currentStep === 1 && <AddressStep onSubmit={handleAddressSubmit} />}

        {currentStep === 2 && (
          <PaymentStep
            onSubmit={handlePaymentSubmit}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <ReviewStep
            checkoutData={checkoutData}
            cart={cart}
            onSubmit={handleOrderSubmit}
            onBack={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
}

export default Checkout;
```

---

### Orders (`/pedidos`)

**Localização:** `src/pages/Orders/Orders.tsx`

**Objetivo:** Histórico de pedidos do usuário.

**Exemplo de Implementação:**

```typescript
import { useState } from "react";
import { useQuery } from "react-query";
import OrderList from "@/components/orders/OrderList";
import OrderFilters from "@/components/orders/OrderFilters";
import Pagination from "@/components/common/Pagination";
import { fetchOrders } from "@/services/api/orders";

function Orders() {
  const [filters, setFilters] = useState({
    status: "",
    page: 1,
  });

  const { data, isLoading } = useQuery(["orders", filters], () =>
    fetchOrders(filters)
  );

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

      <div className="mb-6">
        <OrderFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      {data.pedidos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
          <Link to="/produtos">
            <Button variant="primary">Começar a Comprar</Button>
          </Link>
        </div>
      ) : (
        <>
          <OrderList orders={data.pedidos} />
          <Pagination
            currentPage={filters.page}
            totalPages={data.pagination.total_pages}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </>
      )}
    </div>
  );
}

export default Orders;
```

---

## Proteção de Rotas

### PrivateRoute

**Localização:** `src/routes/PrivateRoute.tsx`

```typescript
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/common/Loading";

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
```

### AdminRoute

**Localização:** `src/routes/AdminRoute.tsx`

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/common/Loading";

interface AdminRouteProps {
  children: React.ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
```

---

## SEO e Meta Tags

### Componente SEO

**Localização:** `src/components/common/SEO/SEO.tsx`

```typescript
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
}

function SEO({
  title,
  description,
  keywords,
  image = "/og-image.png",
  url = window.location.href,
  type = "website",
}: SEOProps) {
  const fullTitle = `${title} | AutozPro`;

  return (
    <Helmet>
      {/* Títulos e Descrição */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

export default SEO;
```

### Uso em Páginas

```typescript
import SEO from "@/components/common/SEO";

function ProductDetails() {
  const { product } = useProduct();

  return (
    <>
      <SEO
        title={product.nome}
        description={product.descricao}
        keywords={`${product.nome}, ${product.categoria.nome}, auto peças`}
        image={product.imagem_url}
        type="product"
      />

      <div>{/* Conteúdo da página */}</div>
    </>
  );
}
```

---

## Lazy Loading

### Implementação

```typescript
import { lazy, Suspense } from "react";
import Loading from "@/components/common/Loading";

// Lazy load de páginas
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));

function App() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <Routes>
        <Route path="/produtos" element={<Products />} />
        <Route path="/produtos/:id" element={<ProductDetails />} />
      </Routes>
    </Suspense>
  );
}
```

### Preload de Rotas

```typescript
import { lazy } from "react";

// Preload function
const preloadComponent = (factory: () => Promise<any>) => {
  factory();
};

// Lazy components com preload
const Products = lazy(() => import("@/pages/Products"));
const ProductDetails = lazy(() => import("@/pages/ProductDetails"));

// Preload ao hover
function Navigation() {
  return (
    <nav>
      <Link
        to="/produtos"
        onMouseEnter={() => preloadComponent(() => import("@/pages/Products"))}
      >
        Produtos
      </Link>
    </nav>
  );
}
```

---

## Páginas Administrativas

### AdminDashboard (`/admin`)

**Localização:** `src/pages/Admin/Dashboard/Dashboard.tsx`

**Objetivo:** Dashboard com estatísticas e métricas.

**Exemplo de Implementação:**

```typescript
import { useQuery } from "react-query";
import StatsCard from "@/components/admin/StatsCard";
import OrdersChart from "@/components/admin/OrdersChart";
import RecentOrders from "@/components/admin/RecentOrders";
import TopProducts from "@/components/admin/TopProducts";
import { fetchAdminStats } from "@/services/api/admin";

function AdminDashboard() {
  const { data: stats, isLoading } = useQuery("admin-stats", fetchAdminStats);

  if (isLoading) return <Loading fullScreen />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Vendas"
          value={`R$ ${stats.total_vendas.toFixed(2)}`}
          trend={stats.vendas_trend}
          icon={<DollarIcon />}
        />
        <StatsCard
          title="Pedidos"
          value={stats.total_pedidos}
          trend={stats.pedidos_trend}
          icon={<ShoppingBagIcon />}
        />
        <StatsCard
          title="Clientes"
          value={stats.total_clientes}
          trend={stats.clientes_trend}
          icon={<UsersIcon />}
        />
        <StatsCard
          title="Ticket Médio"
          value={`R$ ${stats.ticket_medio.toFixed(2)}`}
          trend={stats.ticket_trend}
          icon={<ChartBarIcon />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <OrdersChart data={stats.orders_chart} />
        <TopProducts products={stats.top_products} />
      </div>

      {/* Pedidos recentes */}
      <RecentOrders orders={stats.recent_orders} />
    </div>
  );
}

export default AdminDashboard;
```

---

### AdminProducts (`/admin/produtos`)

**Localização:** `src/pages/Admin/Products/Products.tsx`

**Objetivo:** Gerenciar produtos (CRUD).

**Exemplo de Implementação:**

```typescript
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import ProductTable from "@/components/admin/ProductTable";
import ProductModal from "@/components/admin/ProductModal";
import Button from "@/components/common/Button";
import { fetchAllProducts, deleteProduct } from "@/services/api/admin";

function AdminProducts() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, isLoading } = useQuery("admin-products", fetchAllProducts);

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("admin-products");
      toast.success("Produto excluído com sucesso");
    },
  });

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      await deleteMutation.mutateAsync(productId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
        >
          Adicionar Produto
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <ProductTable
          products={data.produtos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}

export default AdminProducts;
```

---

## Boas Práticas

### 1. Estrutura de Página

```typescript
// Estrutura recomendada
function PageName() {
  // 1. Hooks (useParams, useNavigate, etc)
  // 2. Estados
  // 3. Queries/Mutations
  // 4. Handlers
  // 5. Effects
  // 6. Early returns (loading, error)
  // 7. Render principal

  const { id } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});

  const { data, isLoading, error } = useQuery("key", fetchFn);

  const handleAction = () => {
    // handler logic
  };

  useEffect(() => {
    // side effects
  }, []);

  if (isLoading) return <Loading fullScreen />;
  if (error) return <ErrorPage />;

  return <div>{/* JSX */}</div>;
}
```

### 2. SEO em Todas as Páginas

```typescript
// Sempre adicione SEO component
function ProductDetails() {
  return (
    <>
      <SEO title="Nome do Produto" description="Descrição do produto" />
      <div>{/* conteúdo */}</div>
    </>
  );
}
```

### 3. Loading States

```typescript
// Sempre mostre feedback de loading
function Page() {
  const { isLoading } = useQuery();

  if (isLoading) {
    return <Loading fullScreen text="Carregando..." />;
  }

  return <div>{/* conteúdo */}</div>;
}
```

### 4. Error Handling

```typescript
// Sempre trate erros adequadamente
function Page() {
  const { data, error } = useQuery("key", fetchFn, {
    onError: (err) => {
      toast.error(err.message);
      // Log error
    },
    retry: 3,
  });

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return <div>{/* conteúdo */}</div>;
}
```

### 5. Breadcrumbs

```typescript
// Adicione breadcrumbs para melhor navegação
function ProductDetails() {
  const breadcrumbs = [
    { label: "Início", href: "/" },
    { label: "Produtos", href: "/produtos" },
    { label: product.nome },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      {/* conteúdo */}
    </>
  );
}
```

### 6. Query Parameters

```typescript
// Use query parameters para filtros e estado
function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    categoria: searchParams.get("categoria") || "",
    busca: searchParams.get("busca") || "",
    page: Number(searchParams.get("page")) || 1,
  };

  const handleFilterChange = (newFilters) => {
    setSearchParams(newFilters);
  };

  return <div>{/* conteúdo */}</div>;
}
```

### 7. Scroll to Top

```typescript
// Reset scroll ao navegar
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// No App.tsx
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>{/* rotas */}</Routes>
    </BrowserRouter>
  );
}
```

---

## Estado da Página

### Uso de Query Parameters

```typescript
// Persistir estado na URL
import { useSearchParams } from "react-router-dom";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ler da URL
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "relevancia";

  // Atualizar URL
  const handlePageChange = (newPage: number) => {
    searchParams.set("page", String(newPage));
    setSearchParams(searchParams);
  };

  return <div>{/* conteúdo */}</div>;
}
```

### Preservar Estado ao Navegar

```typescript
// Usar location.state
import { useNavigate, useLocation } from "react-router-dom";

// Navegação com estado
function ProductList() {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/produtos/${product.id}`, {
      state: { from: "/produtos", filters: currentFilters },
    });
  };

  return <div>{/* conteúdo */}</div>;
}

// Recuperar estado
function ProductDetails() {
  const location = useLocation();
  const from = location.state?.from || "/";
  const filters = location.state?.filters;

  const handleBack = () => {
    navigate(from, { state: { filters } });
  };

  return <div>{/* conteúdo */}</div>;
}
```

---

## Performance

### Code Splitting por Rota

```typescript
// Dividir código por rota
const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const Checkout = lazy(() => import("@/pages/Checkout"));

// Com named export
const Admin = lazy(() =>
  import("@/pages/Admin").then((module) => ({ default: module.Admin }))
);
```

### Preload de Dados

```typescript
// Prefetch de dados ao hover
import { useQueryClient } from "react-query";

function ProductCard({ product }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery(["product", product.id], () =>
      fetchProduct(product.id)
    );
  };

  return (
    <Link to={`/produtos/${product.id}`} onMouseEnter={handleMouseEnter}>
      {/* conteúdo */}
    </Link>
  );
}
```

### Infinite Scroll

```typescript
// Para listagens grandes
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";

function Products() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      "products",
      ({ pageParam = 1 }) => fetchProducts({ page: pageParam }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {data.pages.map((page) =>
        page.produtos.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
      <div ref={ref}>{isFetchingNextPage && <Loading />}</div>
    </div>
  );
}
```

---

## Testes de Páginas

### Exemplo de Teste

```typescript
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import Products from "./Products";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe("Products Page", () => {
  it("should render products list", async () => {
    render(<Products />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/produtos/i)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("product-card")).toHaveLength(12);
  });

  it("should filter products by category", async () => {
    const { user } = render(<Products />, { wrapper });

    const categoryFilter = screen.getByLabelText(/categoria/i);
    await user.selectOptions(categoryFilter, "filtros");

    await waitFor(() => {
      expect(screen.getByText(/filtros/i)).toBeInTheDocument();
    });
  });
});
```

---

## Checklist de Página

Ao criar uma nova página, certifique-se de:

- [ ] Adicionar componente SEO com meta tags
- [ ] Implementar loading state
- [ ] Implementar error handling
- [ ] Adicionar breadcrumbs (quando apropriado)
- [ ] Implementar proteção de rota (se necessário)
- [ ] Adicionar testes
- [ ] Otimizar performance (lazy loading, memoization)
- [ ] Garantir responsividade mobile
- [ ] Testar acessibilidade
- [ ] Adicionar analytics events
- [ ] Documentar props e funcionalidades

---

## Recursos Relacionados

- [Guia de Componentes](../components/README.md)
- [Guia de Estado](../guides/state-management.md)
- [Guia de API](../guides/api-integration.md)
- [Guia de Testes](../guides/testing.md)
- [React Router Documentation](https://reactrouter.com/)
