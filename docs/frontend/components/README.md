# Componentes - B77 Auto Parts Frontend

## Índice

- [Visão Geral](#visão-geral)
- [Componentes Comuns](#componentes-comuns)
- [Componentes de Layout](#componentes-de-layout)
- [Componentes de Produtos](#componentes-de-produtos)
- [Componentes de Carrinho](#componentes-de-carrinho)
- [Componentes de Checkout](#componentes-de-checkout)
- [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
- [Exemplos de Uso](#exemplos-de-uso)

---

## Visão Geral

Os componentes do B77 Auto Parts seguem uma arquitetura baseada em **Atomic Design** e **Composition Pattern**, priorizando reutilização, testabilidade e manutenibilidade.

### Princípios de Design

1. **Componentização**: Componentes pequenos e focados
2. **Composição**: Componentes complexos compostos de componentes simples
3. **Isolamento**: Cada componente é independente
4. **Reutilização**: Código DRY (Don't Repeat Yourself)
5. **Tipagem**: TypeScript em todos os componentes
6. **Acessibilidade**: WCAG 2.1 AA compliance

---

## Componentes Comuns

### Button

Componente de botão reutilizável com múltiplas variantes.

**Localização:** `src/components/common/Button/Button.tsx`

**Props:**

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}
```

**Exemplo de Uso:**

```typescript
import Button from "@/components/common/Button";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

function ProductCard() {
  return (
    <Button
      variant="primary"
      size="md"
      leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
      onClick={handleAddToCart}
    >
      Adicionar ao Carrinho
    </Button>
  );
}
```

**Variantes:**

- `primary`: Azul, ação principal
- `secondary`: Cinza, ação secundária
- `danger`: Vermelho, ações destrutivas
- `ghost`: Transparente, ações sutis

---

### Input

Campo de entrada com validação e feedback visual.

**Localização:** `src/components/common/Input/Input.tsx`

**Props:**

```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  mask?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  className?: string;
}
```

**Exemplo de Uso:**

```typescript
import Input from "@/components/common/Input";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <Input
      label="Email"
      type="email"
      value={email}
      onChange={setEmail}
      error={error}
      leftIcon={<EnvelopeIcon className="w-5 h-5" />}
      placeholder="seu@email.com"
      required
    />
  );
}
```

**Máscaras Suportadas:**

- CPF: `999.999.999-99`
- Telefone: `(99) 99999-9999`
- CEP: `99999-999`
- Cartão: `9999 9999 9999 9999`

---

### Modal

Modal acessível e responsivo.

**Localização:** `src/components/common/Modal/Modal.tsx`

**Props:**

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
}
```

**Exemplo de Uso:**

```typescript
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

function ProductDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Ver Detalhes</Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalhes do Produto"
        size="lg"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
            <Button variant="primary" onClick={handleAddToCart}>
              Adicionar ao Carrinho
            </Button>
          </div>
        }
      >
        {/* Conteúdo do modal */}
      </Modal>
    </>
  );
}
```

---

### Card

Container estilizado para conteúdo.

**Localização:** `src/components/common/Card/Card.tsx`

**Props:**

```typescript
interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}
```

**Exemplo de Uso:**

```typescript
import Card from "@/components/common/Card";

function CategoryCard({ category }) {
  return (
    <Card
      title={category.nome}
      subtitle={`${category.produtos_count} produtos`}
      image={category.imagem_url}
      imageAlt={category.nome}
      hoverable
      clickable
      onClick={() => navigate(`/produtos?categoria=${category.id}`)}
    />
  );
}
```

---

### Loading

Indicadores de carregamento.

**Localização:** `src/components/common/Loading/Loading.tsx`

**Props:**

```typescript
interface LoadingProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
  variant?: "spinner" | "dots" | "pulse";
}
```

**Exemplo de Uso:**

```typescript
import Loading from "@/components/common/Loading";

function ProductList() {
  const { data: products, isLoading } = useQuery("products", fetchProducts);

  if (isLoading) {
    return <Loading size="lg" text="Carregando produtos..." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

### ErrorBoundary

Tratamento de erros em componentes.

**Localização:** `src/components/common/ErrorBoundary/ErrorBoundary.tsx`

**Props:**

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

**Exemplo de Uso:**

```typescript
import ErrorBoundary from "@/components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          <h2>Algo deu errado</h2>
          <p>Por favor, recarregue a página</p>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error("Error:", error);
        // Enviar para serviço de monitoramento
      }}
    >
      <YourApp />
    </ErrorBoundary>
  );
}
```

---

## Componentes de Layout

### Header

Cabeçalho principal com navegação e busca.

**Localização:** `src/components/layout/Header/Header.tsx`

**Funcionalidades:**

- Logo e navegação principal
- Barra de busca
- Ícone de carrinho com contador
- Menu de usuário (login/perfil)
- Menu mobile (hamburguer)
- Breadcrumbs

**Exemplo de Uso:**

```typescript
import Header from "@/components/layout/Header";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

---

### Footer

Rodapé com links e informações.

**Localização:** `src/components/layout/Footer/Footer.tsx`

**Seções:**

- Links institucionais
- Links de ajuda
- Redes sociais
- Formas de pagamento
- Selos de segurança
- Copyright

**Exemplo de Uso:**

```typescript
import Footer from "@/components/layout/Footer";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

---

### Sidebar

Menu lateral (desktop e mobile).

**Localização:** `src/components/layout/Sidebar/Sidebar.tsx`

**Props:**

```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: SidebarItem[];
}

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: SidebarItem[];
  badge?: number;
}
```

**Exemplo de Uso:**

```typescript
import Sidebar from "@/components/layout/Sidebar";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    {
      label: "Início",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/",
    },
    {
      label: "Produtos",
      icon: <ShoppingBagIcon className="w-5 h-5" />,
      href: "/produtos",
    },
    {
      label: "Minha Conta",
      icon: <UserIcon className="w-5 h-5" />,
      children: [
        { label: "Perfil", href: "/perfil" },
        { label: "Pedidos", href: "/pedidos", badge: 2 },
        { label: "Endereços", href: "/enderecos" },
      ],
    },
  ];

  return (
    <>
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        items={sidebarItems}
      />
    </>
  );
}
```

---

## Componentes de Produtos

### ProductCard

Card de produto para listagens.

**Localização:** `src/components/products/ProductCard/ProductCard.tsx`

**Props:**

```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  showAddToCart?: boolean;
  layout?: "grid" | "list";
}
```

**Exemplo de Uso:**

```typescript
import ProductCard from "@/components/products/ProductCard";
import { useCart } from "@/hooks/useCart";

function ProductList({ products }) {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
          showAddToCart={product.estoque > 0}
        />
      ))}
    </div>
  );
}
```

**Recursos:**

- Imagem do produto
- Nome e código
- Preço formatado
- Badge de estoque
- Botão "Adicionar ao Carrinho"
- Hover com animações
- Link para detalhes

---

### ProductFilters

Filtros de produtos.

**Localização:** `src/components/products/ProductFilters/ProductFilters.tsx`

**Props:**

```typescript
interface ProductFiltersProps {
  categories: Category[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

interface ProductFilters {
  categoria?: string;
  veiculo_tipo?: "leve" | "pesado";
  preco_min?: number;
  preco_max?: number;
  em_estoque?: boolean;
  busca?: string;
}
```

**Exemplo de Uso:**

```typescript
import ProductFilters from "@/components/products/ProductFilters";

function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({});

  return (
    <div className="flex gap-6">
      <aside className="w-64">
        <ProductFilters
          categories={categories}
          filters={filters}
          onFiltersChange={setFilters}
          onReset={() => setFilters({})}
        />
      </aside>
      <main className="flex-1">
        <ProductList filters={filters} />
      </main>
    </div>
  );
}
```

**Filtros Disponíveis:**

- Categoria (dropdown hierárquico)
- Tipo de veículo (leve/pesado)
- Faixa de preço (slider)
- Apenas em estoque (checkbox)
- Busca por texto

---

### ProductDetails

Detalhes completos do produto.

**Localização:** `src/components/products/ProductDetails/ProductDetails.tsx`

**Props:**

```typescript
interface ProductDetailsProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  relatedProducts?: Product[];
}
```

**Exemplo de Uso:**

```typescript
import ProductDetails from "@/components/products/ProductDetails";
import { useParams } from "react-router-dom";

function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useQuery(["product", id], () =>
    fetchProduct(id)
  );

  if (isLoading) return <Loading />;

  return (
    <ProductDetails
      product={product}
      onAddToCart={handleAddToCart}
      relatedProducts={product.related}
    />
  );
}
```

**Recursos:**

- Galeria de imagens
- Informações detalhadas
- Especificações técnicas
- Seletor de quantidade
- Botão "Adicionar ao Carrinho"
- Produtos relacionados
- Avaliações (futuro)

---

## Componentes de Carrinho

### CartItem

Item individual do carrinho.

**Localização:** `src/components/cart/CartItem/CartItem.tsx`

**Props:**

```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  readonly?: boolean;
}
```

**Exemplo de Uso:**

```typescript
import CartItem from "@/components/cart/CartItem";

function CartList({ items }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
        />
      ))}
    </div>
  );
}
```

**Recursos:**

- Imagem do produto
- Nome e código
- Preço unitário
- Seletor de quantidade
- Subtotal
- Botão remover
- Validação de estoque

---

### CartSummary

Resumo do carrinho com totais.

**Localização:** `src/components/cart/CartSummary/CartSummary.tsx`

**Props:**

```typescript
interface CartSummaryProps {
  subtotal: number;
  frete: number;
  desconto: number;
  total: number;
  onCheckout: () => void;
  loading?: boolean;
}
```

**Exemplo de Uso:**

```typescript
import CartSummary from "@/components/cart/CartSummary";

function CartPage() {
  const { cart, totals } = useCart();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
  );
}
```

**Recursos:**

- Subtotal de produtos
- Cálculo de frete
- Descontos aplicados
- Total final
- Botão "Finalizar Compra"
- Campo de cupom (futuro)

---

### CartDrawer

Carrinho lateral (drawer).

**Localização:** `src/components/cart/CartDrawer/CartDrawer.tsx`

**Props:**

```typescript
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Exemplo de Uso:**

```typescript
import CartDrawer from "@/components/cart/CartDrawer";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  return (
    <header>
      <button onClick={() => setIsCartOpen(true)} className="relative">
        <ShoppingCartIcon className="w-6 h-6" />
        {cart.items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {cart.items.length}
          </span>
        )}
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
```

**Recursos:**

- Slide-in lateral
- Lista de itens resumida
- Subtotal
- Botão "Ver Carrinho"
- Botão "Finalizar Compra"
- Animações suaves

---

## Componentes de Checkout

### CheckoutSteps

Indicador de progresso do checkout.

**Localização:** `src/components/checkout/CheckoutSteps/CheckoutSteps.tsx`

**Props:**

```typescript
interface CheckoutStepsProps {
  currentStep: number;
  steps: Step[];
}

interface Step {
  number: number;
  title: string;
  description?: string;
}
```

**Exemplo de Uso:**

```typescript
import CheckoutSteps from "@/components/checkout/CheckoutSteps";

function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: "Endereço", description: "Dados de entrega" },
    { number: 2, title: "Pagamento", description: "Forma de pagamento" },
    { number: 3, title: "Revisão", description: "Confirmar pedido" },
  ];

  return (
    <div>
      <CheckoutSteps currentStep={currentStep} steps={steps} />
      {/* Conteúdo do step atual */}
    </div>
  );
}
```

---

### AddressForm

Formulário de endereço.

**Localização:** `src/components/checkout/AddressForm/AddressForm.tsx`

**Props:**

```typescript
interface AddressFormProps {
  initialData?: Address;
  onSubmit: (address: Address) => void;
  onCancel?: () => void;
  loading?: boolean;
}
```

**Exemplo de Uso:**

```typescript
import AddressForm from "@/components/checkout/AddressForm";

function CheckoutAddressStep() {
  const handleSubmit = async (address: Address) => {
    await saveAddress(address);
    setCurrentStep(2);
  };

  return <AddressForm onSubmit={handleSubmit} loading={isLoading} />;
}
```

**Recursos:**

- Busca automática de CEP
- Validação de campos
- Máscaras de input
- Seleção de endereço salvo
- Opção "salvar endereço"

---

## Padrões de Desenvolvimento

### 1. Estrutura de Arquivo de Componente

```estrutura
ComponentName/
├── ComponentName.tsx          # Componente principal
├── ComponentName.styles.ts    # Estilos (se necessário)
├── ComponentName.test.tsx     # Testes
├── ComponentName.stories.tsx  # Storybook (futuro)
├── types.ts                   # Tipos específicos
└── index.ts                   # Export
```

### 2. Template de Componente

```typescript
import { FC } from "react";
import clsx from "clsx";

interface ComponentNameProps {
  // Props aqui
  className?: string;
}

export const ComponentName: FC<ComponentNameProps> = ({
  // Destructure props
  className,
}) => {
  // Hooks
  // Estados
  // Handlers

  return <div className={clsx("base-classes", className)}>{/* JSX */}</div>;
};

export default ComponentName;
```

### 3. Composição de Componentes

```typescript
// Componente composto
export const Card = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

Card.Header = ({ children }) => {
  return <div className="card-header">{children}</div>;
};

Card.Body = ({ children }) => {
  return <div className="card-body">{children}</div>;
};

Card.Footer = ({ children }) => {
  return <div className="card-footer">{children}</div>;
};

// Uso
<Card>
  <Card.Header>
    <h3>Título</h3>
  </Card.Header>
  <Card.Body>
    <p>Conteúdo</p>
  </Card.Body>
  <Card.Footer>
    <Button>Ação</Button>
  </Card.Footer>
</Card>;
```

---

## Exemplos de Uso

### Exemplo Completo: Página de Produto

```typescript
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import ProductDetails from "@/components/products/ProductDetails";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useCart } from "@/hooks/useCart";
import { fetchProduct } from "@/services/api/products";

function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery(["product", id], () => fetchProduct(id));

  const handleAddToCart = (quantity: number) => {
    addToCart(product.id, quantity);
    toast.success("Produto adicionado ao carrinho!");
  };

  if (isLoading) {
    return <Loading fullScreen text="Carregando produto..." />;
  }

  if (error) {
    return <ErrorMessage message="Erro ao carregar produto" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails
        product={product}
        onAddToCart={handleAddToCart}
        relatedProducts={product.related}
      />
    </div>
  );
}

export default ProductDetailsPage;
```

---

## Próximos Passos

1. Implementar testes para todos os componentes
2. Criar Storybook para documentação visual
3. Adicionar mais variantes e props
4. Melhorar acessibilidade
5. Otimizar performance

---

## Recursos Relacionados

- [Guia de Páginas](../pages/README.md)
- [Guia de Estado](../guides/state-management.md)
- [Guia de API](../guides/api-integration.md)
- [Guia de Testes](../guides/testing.md)
