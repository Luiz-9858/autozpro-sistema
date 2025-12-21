# 📚 Documentação - AutozPro Sistema E-commerce

Bem-vindo à documentação completa do sistema de e-commerce de auto peças para veículos leves e pesados.

---

## 📋 Índice Geral

### 🔙 [Backend](./backend/)

Documentação completa da API REST e lógica de negócio.

- **[API Endpoints](./backend/api/)** - Todas as rotas e endpoints

  - [Autenticação](./backend/api/authentication.md)
  - [Produtos](./backend/api/products.md)
  - [Pedidos](./backend/api/orders.md)
  - [Carrinho](./backend/api/cart.md)
  - [Usuários](./backend/api/users.md)

- **[Banco de Dados](./backend/database/)** - Estrutura e relacionamentos

  - [Schema](./backend/database/schema.md)
  - [Relacionamentos](./backend/database/relationships.md)
  - [Queries Úteis](./backend/database/queries.md)
  - [Migrations](./backend/database/migrations.md)

- **[Guias](./backend/guides/)** - Tutoriais e configurações

  - [Instalação](./backend/guides/installation.md)
  - [Configuração](./backend/guides/configuration.md)
  - [Regras de Negócio](./backend/guides/business-rules.md)
  - [Deploy](./backend/guides/deployment.md)

- **[Exemplos](./backend/examples/)** - Exemplos práticos
  - [Collection Postman](./backend/examples/postman-collection.json)
  - [Exemplos de Requests](./backend/examples/api-requests.md)

---

### 🎨 [Frontend](./frontend/)

Documentação da interface React + TypeScript + Tailwind.

- **[Componentes](./frontend/components/)** - Componentes reutilizáveis

  - [Visão Geral](./frontend/components/overview.md)
  - [Lista de Componentes](./frontend/components/component-list.md)

- **[Páginas](./frontend/pages/)** - Estrutura de rotas

  - [Rotas](./frontend/pages/routes.md)
  - [Estrutura de Páginas](./frontend/pages/page-structure.md)

- **[Guias](./frontend/guides/)** - Tutoriais frontend

  - [Instalação](./frontend/guides/installation.md)
  - [Estilização (Tailwind)](./frontend/guides/styling.md)
  - [Gerenciamento de Estado](./frontend/guides/state-management.md)
  - [Deploy](./frontend/guides/deployment.md)

- **[Exemplos](./frontend/examples/)** - Snippets de código
  - [Exemplos de Código](./frontend/examples/code-snippets.md)

---

### 📊 [Diagramas](./diagrams/)

Representações visuais do sistema.

- **[Sistema Geral](./diagrams/system/)**

  - Arquitetura Completa
  - Fluxo de Usuário

- **[Backend](./diagrams/backend/)**

  - Diagrama ER (Banco de Dados)
  - Fluxo de API

- **[Frontend](./diagrams/frontend/)**
  - Árvore de Componentes

---

### 📄 [Documentos Gerais](./general/)

- [Visão Geral do Projeto](./general/project-overview.md)
- [Stack Tecnológico](./general/tech-stack.md)
- [Como Contribuir](./general/contributing.md)

---

## 🚀 Início Rápido

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Stack Tecnológica

### Backend

- Node.js + Express
- PostgreSQL / MySQL
- JWT para autenticação
- Prisma / Sequelize (ORM)

### Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- React Router

---

## 📞 Contato

Para dúvidas sobre a documentação, abra uma issue ou entre em contato.

---

**Última atualização:** Dezembro 2025
