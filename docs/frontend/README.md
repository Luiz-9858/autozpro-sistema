# Frontend - AutozPro

## Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Guias de Desenvolvimento](#guias-de-desenvolvimento)
- [Componentes](#componentes)
- [Páginas](#páginas)
- [Padrões e Boas Práticas](#padrões-e-boas-práticas)

---

## Visão Geral

O frontend do **B77 Auto Parts** é uma aplicação React moderna construída com TypeScript, Vite e Tailwind CSS. A aplicação oferece uma experiência de e-commerce completa para compra de auto peças, com recursos de busca avançada, carrinho de compras, gestão de pedidos e painel administrativo.

**Características principais:**

- ⚡ Build ultrarrápido com Vite
- 🎨 Interface moderna e responsiva com Tailwind CSS
- 🔒 Autenticação JWT com proteção de rotas
- 📱 Design mobile-first
- ♿ Acessibilidade (WCAG 2.1)
- 🌐 SEO otimizado
- 🔄 Estado global com Context API
- 📦 Code splitting e lazy loading
- 🧪 Testes com Vitest e Testing Library

---

## Estrutura de Pastas

```"
frontend/
├── public/                      # Arquivos estáticos
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
│
├── src/
│   ├── assets/                 # Imagens, ícones, fontes
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/             # Componentes reutilizáveis
│   │   ├── common/            # Componentes comuns
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Loading/
│   │   │   └── ErrorBoundary/
│   │   │
│   │   ├── layout/            # Componentes de layout
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navigation/
│   │   │
│   │   ├── products/          # Componentes de produtos
│   │   │   ├── ProductCard/
│   │   │   ├── ProductList/
│   │   │   ├── ProductGrid/
│   │   │   ├── ProductFilters/
│   │   │   └── ProductDetails/
│   │   │
│   │   ├── cart/              # Componentes de carrinho
│   │   │   ├── CartItem/
│   │   │   ├── CartSummary/
│   │   │   └── CartDrawer/
│   │   │
│   │   ├── checkout/          # Componentes de checkout
│   │   │   ├── CheckoutSteps/
│   │   │   ├── AddressForm/
│   │   │   ├── PaymentForm/
│   │   │   └── OrderSummary/
│   │   │
│   │   ├── orders/            # Componentes de pedidos
│   │   │   ├── OrderCard/
│   │   │   ├── OrderList/
│   │   │   ├── OrderDetails/
│   │   │   └── OrderStatus/
│   │   │
│   │   ├── user/              # Componentes de usuário
│   │   │   ├── ProfileForm/
│   │   │   ├── AddressCard/
│   │   │   ├── AddressList/
│   │   │   └── PasswordForm/
│   │   │
│   │   └── admin/             # Componentes admin
│   │       ├── Dashboard/
│   │       ├── ProductManager/
│   │       ├── OrderManager/
│   │       └── UserManager/
│   │
│   ├── pages/                  # Páginas da aplicação
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetails/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Orders/
│   │   ├── Profile/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── NotFound/
│   │   └── Admin/
│   │
│   ├── contexts/               # Context API
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── usePagination.ts
│   │   └── useInfiniteScroll.ts
│   │
│   ├── services/               # Serviços e API
│   │   ├── api/
│   │   │   ├── client.ts      # Axios instance configurado
│   │   │   ├── products.ts
│   │   │   ├── auth.ts
│   │   │   ├── cart.ts
│   │   │   ├── orders.ts
│   │   │   └── users.ts
│   │   │
│   │   └── utils/
│   │       ├── storage.ts     # LocalStorage helpers
│   │       ├── validators.ts  # Funções de validação
│   │       └── formatters.ts  # Formatação de dados
│   │
│   ├── types/                  # Tipos TypeScript
│   │   ├── index.ts
│   │   ├── product.types.ts
│   │   ├── user.types.ts
│   │   ├── order.types.ts
│   │   └── cart.types.ts
│   │
│   ├── routes/                 # Configuração de rotas
│   │   ├── index.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── AdminRoute.tsx
│   │
│   ├── styles/                 # Estilos globais
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── animations.css
│   │
│   ├── config/                 # Configurações
│   │   ├── constants.ts
│   │   └── environment.ts
│   │
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts          # Type definitions
│
├── .env.example               # Variáveis de ambiente (exemplo)
├── .env.development           # Variáveis de desenvolvimento
├── .env.production            # Variáveis de produção
├── .eslintrc.json            # Configuração ESLint
├── .prettierrc               # Configuração Prettier
├── tailwind.config.js        # Configuração Tailwind
├── tsconfig.json             # Configuração TypeScript
├── vite.config.ts            # Configuração Vite
└── package.json              # Dependências e scripts
```

---

## Tecnologias Utilizadas

### Core

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5** - Superset do JavaScript com tipagem estática
- **Vite 5** - Build tool e dev server ultrarrápido

### UI e Estilização

- **Tailwind CSS 3** - Framework CSS utility-first
- **Headless UI** - Componentes acessíveis sem estilo
- **Heroicons** - Ícones SVG otimizados
- **React Hot Toast** - Notificações elegantes

### Roteamento

- **React Router DOM 6** - Roteamento declarativo

### Estado e Dados

- **Context API** - Gerenciamento de estado global
- **Axios** - Cliente HTTP
- **React Query** (opcional) - Cache e sincronização de dados

### Formulários e Validação

- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Validação de schemas TypeScript-first

### Utilidades

- **date-fns** - Manipulação de datas
- **clsx** - Concatenação condicional de classes
- **react-input-mask** - Máscaras de input

### Desenvolvimento

- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **Vitest** - Framework de testes
- **Testing Library** - Testes de componentes React

---

## Guias de Desenvolvimento

### 📖 Guias Disponíveis

1. **[Guia de Instalação](./guides/installation.md)**

   - Pré-requisitos
   - Instalação de dependências
   - Configuração do ambiente
   - Execução do projeto

2. **[Guia de Configuração](./guides/configuration.md)**

   - Variáveis de ambiente
   - Configuração do Vite
   - Configuração do Tailwind
   - Configuração do TypeScript

3. **[Guia de Componentes](./components/README.md)**

   - Estrutura de componentes
   - Padrões de design
   - Documentação de componentes
   - Storybook (futuro)

4. **[Guia de Páginas](./pages/README.md)**

   - Estrutura de páginas
   - Roteamento
   - Proteção de rotas
   - SEO e meta tags

5. **[Guia de Estado](./guides/state-management.md)**

   - Context API
   - Custom hooks
   - Padrões de estado
   - Performance

6. **[Guia de API](./guides/api-integration.md)**

   - Configuração do Axios
   - Interceptors
   - Tratamento de erros
   - Cache e otimização

7. **[Guia de Testes](./guides/testing.md)**
   - Configuração de testes
   - Testes de componentes
   - Testes de integração
   - Cobertura de código

---

## Componentes

### Componentes Comuns

Componentes reutilizáveis usados em toda a aplicação:

- **Button** - Botões com variantes (primary, secondary, danger)
- **Input** - Campos de entrada com validação
- **Modal** - Modais acessíveis e responsivos
- **Card** - Container de conteúdo estilizado
- **Loading** - Indicadores de carregamento
- **ErrorBoundary** - Tratamento de erros de componentes

[Ver documentação completa de componentes →](./components/README.md)

### Componentes de Layout

Componentes de estrutura da aplicação:

- **Header** - Cabeçalho com navegação e busca
- **Footer** - Rodapé com links e informações
- **Sidebar** - Menu lateral (mobile e desktop)
- **Navigation** - Navegação principal

### Componentes de Domínio

Componentes específicos de cada domínio da aplicação:

- **Products** - Listagem, cards, filtros de produtos
- **Cart** - Carrinho de compras e resumo
- **Checkout** - Fluxo de finalização de compra
- **Orders** - Gerenciamento de pedidos
- **User** - Perfil e configurações do usuário
- **Admin** - Painel administrativo

---

## Páginas

### Páginas Públicas

- **Home (`/`)** - Página inicial com destaques e categorias
- **Products (`/produtos`)** - Listagem de produtos com filtros
- **ProductDetails (`/produtos/:id`)** - Detalhes do produto
- **Login (`/login`)** - Página de login
- **Register (`/cadastro`)** - Página de registro

### Páginas Autenticadas

- **Cart (`/carrinho`)** - Carrinho de compras
- **Checkout (`/checkout`)** - Finalização de compra
- **Orders (`/pedidos`)** - Histórico de pedidos
- **OrderDetails (`/pedidos/:id`)** - Detalhes do pedido
- **Profile (`/perfil`)** - Perfil do usuário
- **Addresses (`/enderecos`)** - Gerenciamento de endereços

### Páginas Administrativas

- **AdminDashboard (`/admin`)** - Dashboard principal
- **AdminProducts (`/admin/produtos`)** - Gerenciar produtos
- **AdminOrders (`/admin/pedidos`)** - Gerenciar pedidos
- **AdminUsers (`/admin/usuarios`)** - Gerenciar usuários

[Ver documentação completa de páginas →](./pages/README.md)

---

## Padrões e Boas Práticas

### Estrutura de Componentes

```typescript
// ProductCard.tsx
import { FC } from "react";
import { Product } from "@/types/product.types";
import Button from "@/components/common/Button";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img
        src={product.imagem_url}
        alt={product.nome}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="mt-2 text-lg font-semibold">{product.nome}</h3>
      <p className="text-gray-600">{product.codigo}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold">R$ {product.preco.toFixed(2)}</span>
        <Button onClick={() => onAddToCart(product.id)}>Adicionar</Button>
      </div>
    </div>
  );
};

export default ProductCard;
```

### Nomenclatura

- **Componentes**: PascalCase (`ProductCard`, `UserProfile`)
- **Arquivos**: PascalCase para componentes (`ProductCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth`, `useCart`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_CART_ITEMS`)
- **Funções**: camelCase (`formatPrice`, `validateEmail`)
- **Tipos/Interfaces**: PascalCase (`Product`, `UserProfile`)

### Importações

Sempre use importações absolutas com alias:

```typescript
// ✅ Bom
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types/product.types";

// ❌ Evite
import { Button } from "../../../components/common/Button";
```

### TypeScript

- Sempre tipе props de componentes
- Use interfaces para objetos complexos
- Use types para unions e primitivos
- Evite `any`, prefira `unknown`

```typescript
// Interface para props
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

// Type para union
type OrderStatus = "pendente" | "confirmado" | "enviado" | "entregue";
```

### Tailwind CSS

- Use classes utilitárias do Tailwind
- Extraia componentes para estilos repetidos
- Use @apply apenas quando necessário
- Mobile-first (breakpoints: sm, md, lg, xl)

```typescript
// Classes responsivas
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Conteúdo */}
</div>

// States
<button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50">
  Clique aqui
</button>
```

### Performance

- Use `React.memo` para componentes pesados
- Use `useMemo` e `useCallback` quando apropriado
- Implemente lazy loading de rotas
- Otimize imagens (WebP, lazy loading)
- Code splitting por rota

```typescript
// Lazy loading de páginas
import { lazy, Suspense } from "react";

const Products = lazy(() => import("./pages/Products"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Products />
    </Suspense>
  );
}
```

### Acessibilidade

- Use tags semânticas HTML
- Adicione labels em todos os inputs
- Implemente navegação por teclado
- Use atributos ARIA quando necessário
- Teste com leitores de tela

```typescript
// Acessível
<button
  aria-label="Adicionar ao carrinho"
  onClick={handleAddToCart}
>
  <CartIcon />
</button>

// Input acessível
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
/>
```

### Tratamento de Erros

- Use Error Boundaries para erros de componentes
- Trate erros de API adequadamente
- Mostre mensagens amigáveis ao usuário
- Log de erros em produção

```typescript
// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}
```

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Build de produção
npm run preview         # Preview do build

# Qualidade de Código
npm run lint            # Executar ESLint
npm run lint:fix        # Corrigir problemas do ESLint
npm run format          # Formatar código com Prettier

# Testes
npm run test            # Executar testes
npm run test:watch      # Testes em modo watch
npm run test:coverage   # Gerar relatório de cobertura

# Type checking
npm run type-check      # Verificar tipos TypeScript
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```env
# API
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Pagination
VITE_ITEMS_PER_PAGE=12
VITE_MAX_CART_ITEMS=50
```

---

## Próximos Passos

1. ✅ Instalar dependências e configurar ambiente
2. ✅ Explorar a estrutura de pastas
3. ✅ Ler guias de desenvolvimento
4. 📖 Começar a desenvolver componentes
5. 🧪 Escrever testes
6. 🚀 Deploy

---

## Recursos Adicionais

- [Documentação do React](https://react.dev/)
- [Documentação do TypeScript](https://www.typescriptlang.org/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/)
- [Documentação do React Router](https://reactrouter.com/)

---

## Suporte

Para dúvidas ou problemas:

1. Consulte a documentação completa
2. Verifique os guias específicos
3. Abra uma issue no repositório
4. Entre em contato com a equipe

**Documentação relacionada:**

- [Backend API](../backend/README.md)
- [Banco de Dados](../backend/database/schema.md)
- [Guia de Contribuição](../general/contributing.md)
