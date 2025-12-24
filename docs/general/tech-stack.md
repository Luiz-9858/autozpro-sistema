# 🛠️ Stack Tecnológico - B77 Auto Parts

Documentação completa de todas as tecnologias, bibliotecas e ferramentas utilizadas no projeto.

---

## 📊 Visão Geral

```text
┌──────────────────────────────────────────────┐
│              FRONTEND (CLIENT)               │
│  React + TypeScript + Vite + Tailwind CSS   │
└──────────────────┬───────────────────────────┘
                   │ HTTP/REST
                   │
┌──────────────────▼───────────────────────────┐
│              BACKEND (SERVER)                │
│         Node.js + Express + JWT              │
└──────────────────┬───────────────────────────┘
                   │ SQL
                   │
┌──────────────────▼───────────────────────────┐
│               DATABASE                       │
│          PostgreSQL / MySQL                  │
└──────────────────────────────────────────────┘
```

---

## 🔙 Backend

### Runtime & Framework

| Tecnologia  | Versão  | Descrição                      | Documentação                           |
| ----------- | ------- | ------------------------------ | -------------------------------------- |
| **Node.js** | >= 18.x | Runtime JavaScript server-side | [nodejs.org](https://nodejs.org)       |
| **Express** | ^4.18.x | Framework web minimalista      | [expressjs.com](https://expressjs.com) |

**Por que escolhemos:**

- Node.js: Performance, ecossistema rico, JavaScript full-stack
- Express: Simples, flexível, amplamente adotado

---

### Banco de Dados

| Tecnologia     | Versão  | Descrição                | Documentação                                 |
| -------------- | ------- | ------------------------ | -------------------------------------------- |
| **PostgreSQL** | >= 14.x | Banco relacional robusto | [postgresql.org](https://www.postgresql.org) |
| **Prisma**     | ^5.x    | ORM moderno para Node.js | [prisma.io](https://www.prisma.io)           |

**Alternativa:** MySQL + Sequelize

**Por que escolhemos:**

- PostgreSQL: Confiável, ACID compliant, extensível
- Prisma: Type-safe, migrações automáticas, Prisma Studio

---

### Autenticação & Segurança

| Tecnologia             | Versão | Descrição                  |
| ---------------------- | ------ | -------------------------- |
| **jsonwebtoken**       | ^9.x   | Geração e validação de JWT |
| **bcryptjs**           | ^2.4.x | Hash de senhas             |
| **cors**               | ^2.8.x | Controle de CORS           |
| **helmet**             | ^7.x   | Headers de segurança HTTP  |
| **express-rate-limit** | ^7.x   | Limitação de requisições   |

---

### Validação & Processamento

| Tecnologia | Versão | Descrição             |
| ---------- | ------ | --------------------- |
| **joi**    | ^17.x  | Validação de schemas  |
| **multer** | ^1.4.x | Upload de arquivos    |
| **dotenv** | ^16.x  | Variáveis de ambiente |

**Alternativa para validação:** Yup, Zod

---

### Utilitários

| Tecnologia   | Versão  | Descrição                       |
| ------------ | ------- | ------------------------------- |
| **nodemon**  | ^3.x    | Auto-restart em desenvolvimento |
| **morgan**   | ^1.10.x | Logger de requisições HTTP      |
| **date-fns** | ^3.x    | Manipulação de datas            |

---

### Integrações Externas (Backend)

| Serviço                   | Descrição                |
| ------------------------- | ------------------------ |
| **Stripe / MercadoPago**  | Gateway de pagamento     |
| **Correios API**          | Cálculo de frete         |
| **SendGrid / Nodemailer** | Envio de emails          |
| **AWS S3 / Cloudinary**   | Armazenamento de imagens |

---

## 🎨 Frontend

### Core

| Tecnologia     | Versão | Descrição         | Documentação                                         |
| -------------- | ------ | ----------------- | ---------------------------------------------------- |
| **React**      | ^18.x  | Biblioteca UI     | [react.dev](https://react.dev)                       |
| **TypeScript** | ^5.x   | JavaScript tipado | [typescriptlang.org](https://www.typescriptlang.org) |
| **Vite**       | ^5.x   | Build tool rápido | [vitejs.dev](https://vitejs.dev)                     |

**Por que escolhemos:**

- React: Componentização, ecossistema rico, React Hooks
- TypeScript: Type safety, melhor DX, menos bugs
- Vite: Build ultra-rápido, HMR instantâneo

---

### Estilização

| Tecnologia       | Versão | Descrição                   | Documentação                               |
| ---------------- | ------ | --------------------------- | ------------------------------------------ |
| **Tailwind CSS** | ^3.x   | Framework CSS utility-first | [tailwindcss.com](https://tailwindcss.com) |
| **PostCSS**      | ^8.x   | Processador CSS             | [postcss.org](https://postcss.org)         |

**Por que escolhemos:**

- Tailwind: Rápido, customizável, sem CSS customizado
- Menos tempo escrevendo CSS, mais foco na lógica

---

### Roteamento & Estado

| Tecnologia       | Versão   | Descrição                      |
| ---------------- | -------- | ------------------------------ |
| **React Router** | ^6.x     | Roteamento SPA                 |
| **Context API**  | Built-in | Gerenciamento de estado global |

**Alternativas para estado:**

- Redux Toolkit
- Zustand
- Jotai

---

### Requisições HTTP

| Tecnologia | Versão | Descrição    |
| ---------- | ------ | ------------ |
| **Axios**  | ^1.x   | Cliente HTTP |

**Alternativa:** Fetch API nativa, React Query

---

### Formulários & Validação

| Tecnologia          | Versão | Descrição                    |
| ------------------- | ------ | ---------------------------- |
| **React Hook Form** | ^7.x   | Gerenciamento de formulários |
| **Yup / Zod**       | -      | Validação de schemas         |

---

### Utilitários (Frontend)

| Tecnologia                 | Versão | Descrição            |
| -------------------------- | ------ | -------------------- |
| **date-fns**               | ^3.x   | Manipulação de datas |
| **react-icons**            | ^5.x   | Ícones               |
| **react-hot-toast**        | ^2.x   | Notificações/toasts  |
| **react-loading-skeleton** | ^3.x   | Loading states       |

---

### UI Components (Opcional)

| Tecnologia      | Versão | Descrição              |
| --------------- | ------ | ---------------------- |
| **Headless UI** | ^2.x   | Componentes acessíveis |
| **Radix UI**    | ^1.x   | Primitivos de UI       |

---

## 🧪 Testes (Futuro)

### Backend

| Tecnologia    | Descrição           |
| ------------- | ------------------- |
| **Jest**      | Framework de testes |
| **Supertest** | Testes de API       |

### Frontend

| Tecnologia                | Descrição                              |
| ------------------------- | -------------------------------------- |
| **Vitest**                | Testes unitários (compatível com Vite) |
| **React Testing Library** | Testes de componentes                  |
| **Cypress / Playwright**  | Testes E2E                             |

---

## 🚀 DevOps & Deployment

### Controle de Versão

| Tecnologia | Descrição          |
| ---------- | ------------------ |
| **Git**    | Controle de versão |
| **GitHub** | Repositório remoto |

### CI/CD (Futuro)

| Tecnologia         | Descrição      |
| ------------------ | -------------- |
| **GitHub Actions** | Pipeline CI/CD |

### Hospedagem (Sugestões)

#### Backend (Hospedagem)

- **Render** (gratuito para começar)
- **Railway**
- **Heroku**
- **DigitalOcean**
- **AWS EC2**

#### Frontend (Hospedagem)

- **Vercel** (recomendado para React)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages**

#### Banco de Dados (Banco de dados)

- **Render PostgreSQL** (gratuito)
- **Supabase**
- **Railway**
- **AWS RDS**

---

## 📦 Estrutura de Dependências

### Backend - package.json (principais)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "joi": "^17.9.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### Frontend - package.json (principais)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.14.0",
    "axios": "^1.4.0",
    "react-hook-form": "^7.45.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "eslint": "^8.45.0"
  }
}
```

---

## 🔧 Configurações Importantes

### TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Tailwind (tailwind.config.js)

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## 📚 Recursos de Aprendizado

### Documentações Oficiais

- [Node.js Docs](https://nodejs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)

### Tutoriais Recomendados

- [Full Stack Open](https://fullstackopen.com)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

---

## 🔄 Atualizações de Versão

Este documento deve ser atualizado sempre que:

- ✅ Uma nova dependência for adicionada
- ✅ Uma versão maior for atualizada
- ✅ Uma tecnologia for substituída

---

**Última Atualização:** Dezembro 2025
