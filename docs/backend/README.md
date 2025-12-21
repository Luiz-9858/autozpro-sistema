# 🔙 Documentação Backend - AutozPro API

Documentação completa da API REST do sistema de e-commerce de auto peças.

---

## 📋 Índice

### 🔌 [API Endpoints](./api/)

Documentação detalhada de todas as rotas da API.

- **[Autenticação](./api/authentication.md)** - Login, registro, refresh token
- **[Produtos](./api/products.md)** - CRUD de produtos, busca, filtros
- **[Carrinho](./api/cart.md)** - Gerenciamento do carrinho de compras
- **[Pedidos](./api/orders.md)** - Criação e gestão de pedidos
- **[Usuários](./api/users.md)** - Perfil, endereços, histórico

### 🗄️ [Banco de Dados](./database/)

Estrutura e relacionamentos do banco de dados.

- **[Schema](./database/schema.md)** - Todas as tabelas e campos
- **[Relacionamentos](./database/relationships.md)** - Diagrama ER e explicações
- **[Queries Úteis](./database/queries.md)** - Queries SQL importantes
- **[Migrations](./database/migrations.md)** - Histórico de migrações

### 📖 [Guias](./guides/)

Tutoriais e configurações do backend.

- **[Instalação](./guides/installation.md)** - Setup completo do backend
- **[Configuração](./guides/configuration.md)** - Variáveis de ambiente
- **[Regras de Negócio](./guides/business-rules.md)** - Lógica e validações
- **[Deployment](./guides/deployment.md)** - Como fazer deploy

### 💼 [Exemplos](./examples/)

Exemplos práticos de uso da API.

- **[Collection Postman](./examples/postman-collection.json)** - Importar no Postman
- **[Exemplos de Requests](./examples/api-requests.md)** - cURL e código

---

## 🚀 Início Rápido

### Pré-requisitos

```bash
Node.js >= 18.0.0
PostgreSQL >= 14.0 (ou MySQL >= 8.0)
npm ou yarn
```

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrations
npm run migrate

# (Opcional) Popule o banco com dados de teste
npm run seed

# Inicie o servidor em desenvolvimento
npm run dev
```

### Servidor rodando

```
🚀 Servidor rodando em: http://localhost:3000
📚 Documentação API: http://localhost:3000/api-docs (se Swagger configurado)
```

---

## 🛠️ Tecnologias Utilizadas

### Core

- **Node.js** ^18.x - Runtime JavaScript
- **Express** ^4.18.x - Framework web
- **TypeScript** ^5.x (opcional) - Tipagem estática

### Banco de Dados

- **PostgreSQL** ^14.x - Banco relacional
- **Prisma** ^5.x - ORM moderno

### Autenticação & Segurança

- **jsonwebtoken** - Tokens JWT
- **bcryptjs** - Hash de senhas
- **helmet** - Headers de segurança
- **cors** - Controle de CORS
- **express-rate-limit** - Rate limiting

### Validação

- **joi** ^17.x - Validação de schemas

### Utilitários

- **dotenv** - Variáveis de ambiente
- **morgan** - Logger HTTP
- **multer** - Upload de arquivos
- **nodemon** - Auto-restart (dev)

---

## 📂 Estrutura de Pastas

```
backend/
├── src/
│   ├── config/           # Configurações (DB, JWT, etc)
│   ├── controllers/      # Lógica das rotas
│   ├── middlewares/      # Middlewares (auth, validation, etc)
│   ├── models/           # Models do banco (se não usar ORM)
│   ├── routes/           # Definição de rotas
│   ├── services/         # Lógica de negócio
│   ├── utils/            # Funções auxiliares
│   ├── validators/       # Schemas de validação (Joi)
│   ├── app.js            # Configuração do Express
│   └── server.js         # Inicialização do servidor
├── prisma/               # Schema e migrations do Prisma
│   ├── schema.prisma
│   └── migrations/
├── tests/                # Testes automatizados
├── uploads/              # Arquivos enviados (imagens)
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação.

### Como funciona

1. Cliente faz login com email/senha
2. Backend valida e retorna um token JWT
3. Cliente envia o token no header de todas as requisições protegidas
4. Backend valida o token e permite acesso

### Header de autenticação

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Documentação completa:** [Autenticação](./api/authentication.md)

---

## 📊 Rotas Principais

### Públicas (sem autenticação)

```
POST   /api/auth/register          # Registrar novo usuário
POST   /api/auth/login             # Login
GET    /api/products               # Listar produtos
GET    /api/products/:id           # Detalhes do produto
GET    /api/categories             # Listar categorias
```

### Privadas (requer autenticação)

```
GET    /api/users/profile          # Ver perfil
PUT    /api/users/profile          # Atualizar perfil
GET    /api/cart                   # Ver carrinho
POST   /api/cart/items             # Adicionar ao carrinho
POST   /api/orders                 # Criar pedido
GET    /api/orders/my-orders       # Meus pedidos
```

### Admin (requer role admin)

```
POST   /api/products               # Criar produto
PUT    /api/products/:id           # Atualizar produto
DELETE /api/products/:id           # Deletar produto
GET    /api/orders                 # Todos os pedidos
PATCH  /api/orders/:id/status      # Atualizar status do pedido
```

**Documentação completa:** [API Endpoints](./api/)

---

## 🗄️ Banco de Dados

### Tabelas Principais

- `users` - Usuários do sistema
- `products` - Catálogo de produtos
- `categories` - Categorias de produtos
- `cart_items` - Itens no carrinho
- `orders` - Pedidos realizados
- `order_items` - Itens de cada pedido
- `addresses` - Endereços de entrega

**Documentação completa:** [Banco de Dados](./database/)

---

## ⚙️ Variáveis de Ambiente

Arquivo `.env` necessário na raiz do backend:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/autopecas

# JWT
JWT_SECRET=seu_secret_super_secreto_aqui
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Upload
MAX_FILE_SIZE=5242880

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASS=sua_senha

# Pagamento (opcional)
STRIPE_SECRET_KEY=sk_test_...
MERCADOPAGO_ACCESS_TOKEN=TEST-...
```

**Documentação completa:** [Configuração](./guides/configuration.md)

---

## 🧪 Testes

### Rodar testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

---

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor em desenvolvimento (nodemon)
npm start            # Inicia servidor em produção
npm run migrate      # Executa migrations do banco
npm run seed         # Popula banco com dados de teste
npm test             # Executa testes
npm run lint         # Verifica código (ESLint)
npm run format       # Formata código (Prettier)
```

---

## 🚨 Códigos de Status HTTP

A API utiliza os seguintes códigos:

| Código | Significado                               |
| ------ | ----------------------------------------- |
| 200    | OK - Sucesso                              |
| 201    | Created - Recurso criado                  |
| 400    | Bad Request - Dados inválidos             |
| 401    | Unauthorized - Não autenticado            |
| 403    | Forbidden - Sem permissão                 |
| 404    | Not Found - Não encontrado                |
| 409    | Conflict - Conflito (ex: email já existe) |
| 500    | Internal Server Error - Erro no servidor  |

---

## 📋 Formato de Resposta Padrão

### Sucesso

```json
{
  "success": true,
  "data": {
    /* dados da resposta */
  },
  "message": "Operação realizada com sucesso"
}
```

### Erro

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email é obrigatório"
      }
    ]
  }
}
```

---

## 🐛 Troubleshooting

### Erro ao conectar no banco

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solução:** Verifique se o PostgreSQL está rodando e se as credenciais no `.env` estão corretas.

### Erro de CORS

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solução:** Adicione a URL do frontend em `ALLOWED_ORIGINS` no `.env`.

### Token JWT inválido

```
401 Unauthorized: Invalid token
```

**Solução:** Verifique se o token não expirou e se está sendo enviado corretamente no header.

---

## 📞 Suporte

Para dúvidas ou problemas:

- Abra uma issue no GitHub
- Consulte a documentação completa
- Entre em contato: [luizfernandodev16@gmail.com]

---

**Última atualização:** Dezembro 2025
