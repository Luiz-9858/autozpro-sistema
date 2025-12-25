# Guia de Contribuição - B77 Auto Parts

## Índice

- [Bem-vindo](#bem-vindo)
- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Git Workflow](#git-workflow)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Code Review](#code-review)
- [Testes](#testes)
- [Documentação](#documentação)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

---

## Bem-vindo

Obrigado por considerar contribuir com o **B77 Auto Parts**! 🎉

Este documento fornece diretrizes para contribuir com o projeto. Seguir estas diretrizes ajuda a comunicar que você respeita o tempo dos desenvolvedores que gerenciam e desenvolvem este projeto open source.

---

## Código de Conduta

### Nosso Compromisso

No interesse de promover um ambiente aberto e acolhedor, nós, como colaboradores e mantenedores, nos comprometemos a tornar a participação em nosso projeto e em nossa comunidade uma experiência livre de assédio para todos.

### Nossos Padrões

**Exemplos de comportamento que contribuem para criar um ambiente positivo:**

- Usar linguagem acolhedora e inclusiva
- Ser respeitoso com pontos de vista e experiências diferentes
- Aceitar críticas construtivas com elegância
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros da comunidade

**Exemplos de comportamento inaceitável:**

- Uso de linguagem ou imagens sexualizadas
- Comentários insultuosos/depreciativos e ataques pessoais ou políticos
- Assédio público ou privado
- Publicar informações privadas de outros sem permissão explícita
- Outra conduta que poderia razoavelmente ser considerada inadequada

### Aplicação

Instâncias de comportamento abusivo, de assédio ou de outra forma inaceitável podem ser relatadas entrando em contato com a equipe do projeto. Todas as reclamações serão revisadas e investigadas.

---

## Como Contribuir

Existem várias formas de contribuir com o B77 Auto Parts:

### 1. Reportar Bugs 🐛

Encontrou um bug? [Abra uma issue](# reportar-bugs) detalhando o problema.

### 2. Sugerir Funcionalidades 💡

Tem uma ideia? [Sugira uma nova funcionalidade](#sugerir-funcionalidades).

### 3. Melhorar Documentação 📚

Documentação nunca é demais! Corrija erros, adicione exemplos ou melhore explicações.

### 4. Contribuir com Código 💻

Implemente novas funcionalidades ou corrija bugs existentes.

### 5. Revisar Pull Requests 👀

Ajude revisando PRs abertos e fornecendo feedback construtivo.

### 6. Responder Issues 💬

Ajude outros usuários respondendo perguntas nas issues.

---

## Configuração do Ambiente

### Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x ou **yarn** >= 1.22.x
- **PostgreSQL** >= 14.x
- **Git**
- Editor de código (recomendamos VS Code)

### Passo a Passo

1. **Fork o repositório**

   ```bash
   # Clique no botão "Fork" no GitHub
   ```

2. **Clone seu fork**

   ```bash
   git clone https://github.com/Luiz-9858/b77autoparts.git
   cd autozpro
   ```

3. **Adicione o repositório original como upstream**

   ```bash
   git remote add upstream https://github.com/original/b77autoparts.git
   ```

4. **Instale as dependências**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

5. **Configure as variáveis de ambiente**

   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edite o .env com suas configurações

   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edite o .env com suas configurações
   ```

6. **Configure o banco de dados**

   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

7. **Execute o projeto**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

8. **Acesse a aplicação**
   - Frontend: http:// localhost:5173
   - Backend: http:// localhost:3001

### Extensões Recomendadas (VS Code)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "usernamehw.errorlens",
    "eamodio.gitlens"
  ]
}
```

---

## Padrões de Código

### Geral

- **Idioma**: Código em **inglês**, comentários e documentação em **português**
- **Indentação**: 2 espaços
- **Aspas**: Simples (`'`) para strings
- **Ponto e vírgula**: Obrigatório
- **Linha máxima**: 100 caracteres (recomendado)

### JavaScript/TypeScript

```typescript
// ✅ Bom
const fetchProducts = async (filters: ProductFilters): Promise<Product[]> => {
  try {
    const response = await api.get("/products", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// ❌ Evite
const fetchProducts = async (filters) => {
  const response = await api.get("/products", { params: filters });
  return response.data;
};
```

### Nomenclatura

**Variáveis e Funções:**

```typescript
// camelCase
const userName = "João";
const calculateTotal = (items) => {};
```

**Componentes React:**

```typescript
// PascalCase
const ProductCard = () => {};
const UserProfile = () => {};
```

**Constantes:**

```typescript
// UPPER_SNAKE_CASE
const API_BASE_URL = "http://localhost:3000";
const MAX_ITEMS_PER_PAGE = 20;
```

**Tipos e Interfaces:**

```typescript
// PascalCase
interface Product {}
type OrderStatus = "pending" | "confirmed";
```

**Arquivos:**

```"
// Componentes: PascalCase
ProductCard.tsx
UserProfile.tsx

// Utilitários: camelCase
formatDate.ts
validators.ts

// Páginas: PascalCase
Home.tsx
Products.tsx
```

### TypeScript

- **Sempre** use tipagem explícita
- Evite `any`, prefira `unknown`
- Use interfaces para objetos
- Use types para unions e primitivos

```typescript
// ✅ Bom
interface User {
  id: string;
  nome: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementação
};

// ❌ Evite
const getUser = async (id: any): Promise<any> => {
  // implementação
};
```

### React

**Componentes Funcionais:**

```typescript
import { FC } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
}) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  );
};

export default Button;
```

**Hooks:**

```typescript
// Custom hook sempre começa com 'use'
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  // lógica do hook

  return { user, login, logout };
};
```

### CSS/Tailwind

- Prefira classes do Tailwind
- Use ordem consistente de classes
- Agrupe classes relacionadas

```typescript
// ✅ Bom - Classes ordenadas logicamente
<div className="
  flex items-center justify-between
  w-full max-w-4xl
  p-4 m-2
  bg-white rounded-lg shadow-md
  hover:shadow-lg
  transition-shadow
">
```

### Node.js/Express

**Estrutura de Controladores:**

```typescript
// controllers/productController.ts
import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.findAll(req.query);

    return res.status(200).json({
      produtos: products,
      total: products.length,
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({
      error: "Erro ao buscar produtos",
      message: error.message,
    });
  }
};
```

### Banco de Dados (Prisma)

**Nomenclatura:**

```prisma
// snake_case para campos
model User {
  id         String   @id @default(uuid())
  nome       String
  email      String   @unique
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  @@map("users")
}
```

---

## Git Workflow

### Branches

Utilizamos o modelo **Git Flow** simplificado:

```Git Worflow
main (produção)
  └── develop (desenvolvimento)
       ├── feature/nome-da-feature
       ├── bugfix/nome-do-bug
       ├── hotfix/nome-do-hotfix
       └── docs/nome-da-doc
```

**Tipos de branches:**

- **`main`**: Código em produção (protegida)
- **`develop`**: Branch de desenvolvimento principal
- **`feature/*`**: Novas funcionalidades
- **`bugfix/*`**: Correção de bugs
- **`hotfix/*`**: Correções urgentes em produção
- **`docs/*`**: Melhorias na documentação

### Criando uma Branch

```bash
# Sempre crie branches a partir da develop atualizada
git checkout develop
git pull upstream develop

# Crie sua branch
git checkout -b feature/nome-da-feature
```

### Nomenclatura de Branches

```bash
# ✅ Bom
feature/add-product-filters
bugfix/fix-cart-total-calculation
docs/update-api-documentation
hotfix/fix-payment-gateway

# ❌ Evite
my-feature
fix
updates
```

### Mantendo sua Branch Atualizada

```bash
# Atualize sua branch com as mudanças da develop
git checkout develop
git pull upstream develop
git checkout feature/sua-feature
git rebase develop

# Ou use merge (se preferir)
git merge develop
```

---

## Commits

### Padrão de Commits (Conventional Commits)

Usamos o padrão **Conventional Commits**:

```Commits
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

**Tipos:**

- **`feat`**: Nova funcionalidade
- **`fix`**: Correção de bug
- **`docs`**: Documentação
- **`style`**: Formatação (não afeta código)
- **`refactor`**: Refatoração
- **`test`**: Adicionar/corrigir testes
- **`chore`**: Tarefas gerais (build, config)
- **`perf`**: Melhoria de performance

**Exemplos:**

```bash
# Feature
git commit -m "feat(products): add product filters by category"

# Bugfix
git commit -m "fix(cart): fix total calculation with discount"

# Documentation
git commit -m "docs(api): add orders endpoint documentation"

# Refactor
git commit -m "refactor(auth): simplify JWT token generation"

# Multiple files
git commit -m "feat(checkout): implement multi-step checkout process

- Add address step component
- Add payment step component
- Add review step component
- Integrate with orders API"

# Breaking change
git commit -m "feat(api)!: change product response structure

BREAKING CHANGE: Product API now returns nested category object instead of category_id"
```

### Boas Práticas de Commits

✅ **Faça:**

- Commits pequenos e atômicos
- Mensagens claras e descritivas
- Commits frequentes
- Use o imperativo ("add" não "added")
- Primeira linha com até 72 caracteres

❌ **Evite:**

- Commits gigantes com múltiplas mudanças
- Mensagens vagas ("fix", "update", "changes")
- Commitar código comentado
- Commitar arquivos de configuração pessoal

### Verificando antes de Commitar

```bash
# Veja o que será commitado
git status
git diff

# Adicione arquivos específicos
git add src/components/Button.tsx
git add src/components/Input.tsx

# Ou adicione tudo (com cuidado)
git add .

# Commit
git commit -m "feat(components): add Button and Input components"
```

---

## Pull Requests

### Antes de Abrir um PR

1. ✅ Certifique-se de que seu código está funcionando
2. ✅ Execute os testes: `npm test`
3. ✅ Execute o linter: `npm run lint`
4. ✅ Atualize a documentação se necessário
5. ✅ Teste manualmente as mudanças
6. ✅ Rebase com a branch develop

### Criando um Pull Request

1. **Push sua branch**

   ```bash
   git push origin feature/sua-feature
   ```

2. **Abra o PR no GitHub**
   - Vá para o repositório no GitHub
   - Clique em "New Pull Request"
   - Selecione sua branch
   - Preencha o template

### Template de Pull Request

```markdown
## Descrição

Breve descrição das mudanças realizadas.

## Tipo de Mudança

- [ ] 🐛 Bugfix
- [ ] ✨ Nova funcionalidade
- [ ] 📚 Documentação
- [ ] 🎨 Estilo/Formatação
- [ ] ♻️ Refatoração
- [ ] ⚡ Performance
- [ ] ✅ Testes

## Motivação e Contexto

Por que essa mudança é necessária? Qual problema ela resolve?

Closes #(issue)

## Como Foi Testado?

Descreva como você testou suas mudanças.

- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes manuais

## Screenshots (se aplicável)

Adicione screenshots para mudanças visuais.

## Checklist

- [ ] Meu código segue os padrões do projeto
- [ ] Realizei uma auto-revisão do meu código
- [ ] Comentei código complexo
- [ ] Atualizei a documentação
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que provam que minha correção/feature funciona
- [ ] Testes novos e existentes passam localmente
- [ ] Mudanças dependentes foram mergeadas
```

### Boas Práticas de PR

✅ **Faça:**

- PRs pequenos e focados (máximo 400 linhas)
- Título descritivo
- Descrição detalhada
- Screenshots para mudanças visuais
- Linkar issues relacionadas
- Responder comentários rapidamente

❌ **Evite:**

- PRs gigantes com múltiplas features
- Descrições vagas
- Ignorar comentários de revisão
- Forçar merge sem aprovação

---

## Code Review

### Para Revisores

**O que procurar:**

1. **Funcionalidade**: O código faz o que deveria?
2. **Legibilidade**: O código é fácil de entender?
3. **Manutenibilidade**: Será fácil manter/modificar?
4. **Performance**: Há problemas de performance?
5. **Segurança**: Há vulnerabilidades?
6. **Testes**: As mudanças estão testadas?
7. **Documentação**: Está documentado adequadamente?

**Como revisar:**

````markdown
# ✅ Comentário Construtivo

Considere extrair essa lógica para uma função separada
para melhorar a legibilidade:

```typescript
const calculateDiscountedPrice = (price: number, discount: number) => {
  return price * (1 - discount / 100);
};
```
````

Isso tornará o código mais testável e reutilizável.

❌ Comentário Não Construtivo

Esse código está ruim.

````Comentário não construtivo

**Tipos de comentários:**

- 🔴 **Bloqueante**: Deve ser corrigido antes do merge
- 🟡 **Sugestão**: Melhoria recomendada
- 🔵 **Pergunta**: Dúvida ou pedido de esclarecimento
- 🟢 **Elogio**: Código bem escrito

### Para Autores

**Respondendo Reviews:**

```markdown
# ✅ Resposta Boa
Ótima sugestão! Implementei a mudança no commit abc123.
Também adicionei testes para cobrir esse caso.

# ✅ Resposta Boa (discordando educadamente)
Obrigado pela sugestão! Neste caso, preferi manter a
implementação atual porque [razão]. O que você acha?

# ❌ Resposta Ruim
Ok.
````

**Após as Revisões:**

1. Faça as correções solicitadas
2. Responda todos os comentários
3. Marque conversas como resolvidas
4. Solicite nova revisão

---

## Testes

### Backend

**Estrutura de Testes:**

```backend
backend/
└── tests/
    ├── unit/
    │   ├── services/
    │   └── utils/
    └── integration/
        ├── api/
        └── database/
```

**Exemplo de Teste:**

```typescript
// tests/unit/services/productService.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { productService } from "@/services/productService";

describe("ProductService", () => {
  describe("calculateDiscount", () => {
    it("should calculate 10% discount correctly", () => {
      const result = productService.calculateDiscount(100, 10);
      expect(result).toBe(90);
    });

    it("should return original price when discount is 0", () => {
      const result = productService.calculateDiscount(100, 0);
      expect(result).toBe(100);
    });

    it("should throw error for invalid discount", () => {
      expect(() => productService.calculateDiscount(100, -10)).toThrow(
        "Discount must be between 0 and 100"
      );
    });
  });
});
```

### Frontend

**Estrutura de Testes:**

```frontend
frontend/
└── src/
    ├── components/
    │   └── Button/
    │       ├── Button.tsx
    │       └── Button.test.tsx
    └── pages/
        └── Home/
            ├── Home.tsx
            └── Home.test.tsx
```

**Exemplo de Teste:**

```typescript
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("should render button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDisabled();
  });
});
```

### Executando Testes

```bash
# Backend
cd backend
npm test                 # Todos os testes
npm test -- --coverage   # Com cobertura
npm test -- --watch      # Modo watch

# Frontend
cd frontend
npm test                 # Todos os testes
npm test -- --coverage   # Com cobertura
npm test -- --watch      # Modo watch
```

### Cobertura de Testes

**Meta de cobertura:**

- Statements: >= 80%
- Branches: >= 75%
- Functions: >= 80%
- Lines: >= 80%

---

## Documentação

### O que Documentar

1. **Código complexo**: Adicione comentários explicativos
2. **APIs**: Documente todos os endpoints
3. **Componentes**: Props, uso e exemplos
4. **Funções utilitárias**: Parâmetros e retorno
5. **Configurações**: Como configurar o projeto

### Comentários no Código

```typescript
// ✅ Bom - Explica o "porquê"
// Validamos o CPF antes de salvar para garantir integridade dos dados
// pois o banco não possui constraint para este campo
if (!validateCPF(user.cpf)) {
  throw new Error("CPF inválido");
}

// ❌ Desnecessário - Apenas repete o código
// Valida o CPF
if (!validateCPF(user.cpf)) {
  throw new Error("CPF inválido");
}
```

### JSDoc (quando necessário)

````typescript
/**
 * Calcula o preço com desconto aplicado
 *
 * @param price - Preço original do produto
 * @param discount - Percentual de desconto (0-100)
 * @returns Preço final após aplicar o desconto
 * @throws {Error} Se o desconto for inválido
 *
 * @example
 * ```typescript
 * const finalPrice = calculateDiscount(100, 10);
 * // Returns: 90
 * ```
 */
function calculateDiscount(price: number, discount: number): number {
  if (discount < 0 || discount > 100) {
    throw new Error("Discount must be between 0 and 100");
  }
  return price * (1 - discount / 100);
}
````

### README de Componentes

Cada componente complexo deve ter documentação:

````markdown
# Button Component

Componente de botão reutilizável com múltiplas variantes.

## Props

| Prop     | Type                                 | Default   | Description                  |
| -------- | ------------------------------------ | --------- | ---------------------------- |
| variant  | 'primary' \| 'secondary' \| 'danger' | 'primary' | Estilo visual do botão       |
| size     | 'sm' \| 'md' \| 'lg'                 | 'md'      | Tamanho do botão             |
| disabled | boolean                              | false     | Se o botão está desabilitado |

## Exemplo

```typescript
<Button variant="primary" size="lg">
  Adicionar ao Carrinho
</Button>
```

---

## Reportar Bugs

### Antes de Reportar

1. ✅ Procure por issues similares
2. ✅ Verifique se o bug ainda existe na versão mais recente
3. ✅ Tente reproduzir o bug

### Template de Bug Report

```markdown
**Descrição do Bug**
Uma descrição clara e concisa do bug.

**Para Reproduzir**
Passos para reproduzir o comportamento:

1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

**Comportamento Esperado**
Descrição clara do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**

- OS: [ex: Windows 11]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.0.0]

**Informações Adicionais**
Qualquer outra informação sobre o problema.
```
````

---

## Sugerir Funcionalidades

### Template de Feature Request

```markdown
**A funcionalidade está relacionada a um problema?**
Uma descrição clara do problema. Ex: Sempre fico frustrado quando [...]

**Descreva a solução que você gostaria**
Uma descrição clara da funcionalidade desejada.

**Descreva alternativas consideradas**
Descrição de soluções ou funcionalidades alternativas.

**Contexto Adicional**
Qualquer outro contexto ou screenshots sobre a funcionalidade.
```

---

## Deploy

### Ambiente de Staging

Mudanças na branch `develop` são automaticamente deployadas para staging.

**URL:** https: //staging.b77autoparts.com

### Ambiente de Produção

Apenas após aprovação e merge na `main`.

**URL:** https: //b77autoparts.com

### Checklist de Deploy

- [ ] Todos os testes passando
- [ ] Code review aprovado
- [ ] Documentação atualizada
- [ ] Changelog atualizado
- [ ] Migrations testadas
- [ ] Variáveis de ambiente configuradas
- [ ] Monitoring ativo

---

## Perguntas Frequentes

### Como faço para começar a contribuir?

1. Leia este guia completamente
2. Configure o ambiente de desenvolvimento
3. Procure por issues com label `good first issue`
4. Comente na issue que deseja trabalhar nela
5. Crie uma branch e comece a codar!

### Quanto tempo leva para meu PR ser revisado?

Normalmente 2-3 dias úteis. PRs urgentes (hotfixes) são priorizados.

### Posso trabalhar em várias issues ao mesmo tempo?

Sim, mas recomendamos focar em uma issue por vez para manter a qualidade.

### Meu PR foi rejeitado, e agora?

Não desanime! Leia os comentários, faça as correções e resubmeta.

### Como entro em contato com a equipe?

- GitHub Issues: Para bugs e features
- Discord: Para discussões gerais
- Email: contato @autozpro.com

---

## Recursos

### Documentação do Projeto

- [Visão Geral](./project-overview.md)
- [Stack Tecnológica](./tech-stack.md)
- [API Backend](../backend/README.md)
- [Frontend](../frontend/README.md)

### Guias Externos

- [Git Book](https://git-scm.com/book/pt-br/v2)
- [Conventional Commits](https://www.conventionalcommits.org/pt-br)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

---

## Agradecimentos

Obrigado por contribuir com o B77 Auto Parts! 🚀

Cada contribuição, não importa o tamanho, faz diferença. Seja corrigindo um tipo na documentação ou implementando uma feature completa, sua ajuda é muito apreciada!

\*_Happy Coding! 💻 ✨_
