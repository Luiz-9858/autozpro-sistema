# 🔐 API - Autenticação

Documentação completa dos endpoints de autenticação e gerenciamento de sessão.

---

## 📋 Índice

- [Registrar Novo Usuário](#registrar-novo-usuário)
- [Login](#login)
- [Logout](#logout)
- [Refresh Token](#refresh-token)
- [Verificar Token](#verificar-token)
- [Recuperar Senha](#recuperar-senha)
- [Redefinir Senha](#redefinir-senha)
- [Alterar Senha](#alterar-senha)

---

## 📝 Registrar Novo Usuário

Cria uma nova conta de usuário.

### Endpoint

```http
POST /api/auth/register
```

### Autenticação

❌ Não requerida (rota pública)

### Body (JSON)

```json
{
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "senha": "SenhaForte123!",
  "cpf": "123.456.789-00",
  "telefone": "(14) 98800-9858"
}
```

### Validações

| Campo      | Validação                                                        |
| ---------- | ---------------------------------------------------------------- |
| `nome`     | String, obrigatório, 3-200 caracteres                            |
| `email`    | Email válido, único, obrigatório                                 |
| `senha`    | Mínimo 8 caracteres, 1 maiúscula, 1 número, 1 caractere especial |
| `cpf`      | CPF válido (com ou sem formatação), único                        |
| `telefone` | String, formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX               |

### Regras de Negócio

- Email deve ser único no sistema
- CPF deve ser único no sistema
- Senha é criptografada com bcrypt (salt rounds: 10)
- Usuário criado com role `customer` por padrão
- Conta criada como ativa por padrão

### Exemplo de Requisição

**cURL:**

```bash
curl -X POST http://localhost:3001/api/auth/register \s
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao.silva@email.com",
    "senha": "SenhaForte123!",
    "cpf": "123.456.789-00",
    "telefone": "(14) 98800-9858"
  }'
```

**JavaScript (Axios):**

```javascript
const response = await axios.post("/api/auth/register", {
  nome: "João Silva",
  email: "joao.silva@email.com",
  senha: "SenhaForte123!",
  cpf: "123.456.789-00",
  telefone: "(14) 98800-9858",
});
```

**JavaScript (Fetch):**

```javascript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    nome: "João Silva",
    email: "joao.silva@email.com",
    senha: "SenhaForte123!",
  }),
});
const data = await response.json();
```

### Resposta de Sucesso (201)

```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "cpf": "123.456.789-00",
      "telefone": "(14) 98800-9858",
      "role": "customer",
      "ativo": true,
      "created_at": "2024-12-20T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3MDMwNzAwMDAsImV4cCI6MTcwMzE1NjQwMH0.signature",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### Respostas de Erro

**400 - Dados Inválidos:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      },
      {
        "field": "senha",
        "message": "Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, número e caractere especial"
      },
      {
        "field": "cpf",
        "message": "CPF inválido"
      }
    ]
  }
}
```

**409 - Email/CPF Já Existe:**

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_USER",
    "message": "Email já está cadastrado no sistema"
  }
}
```

---

## 🔑 Login

Autentica um usuário e retorna token JWT.

### Endpoint

```http
POST /api/auth/login
```

### Autenticação

❌ Não requerida

### Body (JSON)

```json
{
  "email": "joao.silva@email.com",
  "senha": "SenhaForte123!"
}
```

### Validações

| Campo   | Validação                 |
| ------- | ------------------------- |
| `email` | Email válido, obrigatório |
| `senha` | String, obrigatório       |

### Exemplo de Requisição

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "senha": "SenhaForte123!"
  }'
```

**JavaScript:**

```javascript
const response = await axios.post("/api/auth/login", {
  email: "joao.silva@email.com",
  senha: "SenhaForte123!",
});

// Salvar token
localStorage.setItem("token", response.data.data.token);
localStorage.setItem("refreshToken", response.data.data.refreshToken);
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "role": "customer",
      "avatar_url": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### Respostas de Erro

**400 - Campos Obrigatórios:**

```json
{
  "success": false,
  "error": {
    "code": "MISSING_FIELDS",
    "message": "Email e senha são obrigatórios"
  }
}
```

**401 - Credenciais Inválidas:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou senha incorretos"
  }
}
```

**403 - Conta Inativa:**

```json
{
  "success": false,
  "error": {
    "code": "ACCOUNT_DISABLED",
    "message": "Sua conta foi desativada. Entre em contato com o suporte."
  }
}
```

---

## 🚪 Logout

Invalida o token atual (se implementado com blacklist).

### Endpoint

```http
POST /api/auth/logout
```

### Autenticação

✅ **Requerida** (Token JWT)

### Headers

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Body

Não requer body.

### Exemplo de Requisição

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer SEU_TOKEN"
```

**JavaScript:**

```javascript
await axios.post(
  "/api/auth/logout",
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

// Limpar localStorage
localStorage.removeItem("token");
localStorage.removeItem("refreshToken");
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 🔄 Refresh Token

Gera um novo access token usando o refresh token.

### Endpoint

```http
POST /api/auth/refresh
```

### Autenticação

❌ Não requerida (usa refresh token no body)

### Body (JSON)

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Exemplo de Requisição

**JavaScript:**

```javascript
const response = await axios.post("/api/auth/refresh", {
  refreshToken: localStorage.getItem("refreshToken"),
});

// Atualizar tokens
localStorage.setItem("token", response.data.data.token);
localStorage.setItem("refreshToken", response.data.data.refreshToken);
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Token renovado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### Respostas de Erro

**401 - Refresh Token Inválido:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "message": "Refresh token inválido ou expirado"
  }
}
```

---

## ✅ Verificar Token

Verifica se o token JWT é válido.

### Endpoint

```
GET /api/auth/verify
```

### Autenticação

✅ **Requerida** (Token JWT)

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Exemplo de Requisição

**JavaScript:**

```javascript
try {
  const response = await axios.get("/api/auth/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("Token válido!");
} catch (error) {
  console.log("Token inválido, redirecionar para login");
}
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "role": "customer",
    "email": "joao.silva@email.com"
  }
}
```

### Respostas de Erro

**401 - Token Inválido:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Token inválido ou expirado"
  }
}
```

---

## 🔓 Recuperar Senha

Envia email com link para redefinir senha.

### Endpoint

```
POST /api/auth/forgot-password
```

### Autenticação

❌ Não requerida

### Body (JSON)

```json
{
  "email": "joao.silva@email.com"
}
```

### Exemplo de Requisição

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "joao.silva@email.com"}'
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Email de recuperação enviado com sucesso. Verifique sua caixa de entrada."
}
```

**Nota:** Por segurança, sempre retorna sucesso mesmo se o email não existir.

### Fluxo Completo

1. Cliente envia email
2. Backend gera token temporário (válido por 1 hora)
3. Email enviado com link: `https://frontend.com/reset-password?token=abc123`
4. Cliente acessa link e redefine senha

---

## 🔐 Redefinir Senha

Redefine a senha usando o token recebido por email.

### Endpoint

```
POST /api/auth/reset-password
```

### Autenticação

❌ Não requerida (usa token de reset)

### Body (JSON)

```json
{
  "token": "abc123xyz789...",
  "novaSenha": "NovaSenhaForte456!"
}
```

### Validações

| Campo       | Validação                                              |
| ----------- | ------------------------------------------------------ |
| `token`     | String, obrigatório                                    |
| `novaSenha` | Mínimo 8 caracteres, 1 maiúscula, 1 número, 1 especial |

### Exemplo de Requisição

**JavaScript:**

```javascript
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

const response = await axios.post("/api/auth/reset-password", {
  token: token,
  novaSenha: "NovaSenhaForte456!",
});
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Senha redefinida com sucesso. Você já pode fazer login."
}
```

### Respostas de Erro

**400 - Token Inválido ou Expirado:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_RESET_TOKEN",
    "message": "Token de recuperação inválido ou expirado. Solicite um novo."
  }
}
```

---

## 🔒 Alterar Senha

Altera a senha do usuário logado.

### Endpoint

```
PUT /api/auth/change-password
```

### Autenticação

✅ **Requerida** (Token JWT)

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Body (JSON)

```json
{
  "senhaAtual": "SenhaForte123!",
  "novaSenha": "NovaSenhaForte456!"
}
```

### Validações

| Campo        | Validação                               |
| ------------ | --------------------------------------- |
| `senhaAtual` | String, obrigatório                     |
| `novaSenha`  | Mínimo 8 caracteres, diferente da atual |

### Exemplo de Requisição

**JavaScript:**

```javascript
const response = await axios.put(
  "/api/auth/change-password",
  {
    senhaAtual: "SenhaForte123!",
    novaSenha: "NovaSenhaForte456!",
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Senha alterada com sucesso"
}
```

### Respostas de Erro

**400 - Senha Atual Incorreta:**

```json
{
  "success": false,
  "error": {
    "code": "INCORRECT_PASSWORD",
    "message": "Senha atual incorreta"
  }
}
```

**400 - Nova Senha Igual à Atual:**

```json
{
  "success": false,
  "error": {
    "code": "SAME_PASSWORD",
    "message": "Nova senha deve ser diferente da senha atual"
  }
}
```

---

## 🔐 Estrutura do Token JWT

### Payload do Token

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "joao.silva@email.com",
  "role": "customer",
  "iat": 1703070000,
  "exp": 1703156400
}
```

### Campos

| Campo    | Descrição                           |
| -------- | ----------------------------------- |
| `userId` | ID único do usuário                 |
| `email`  | Email do usuário                    |
| `role`   | Nível de acesso (customer, admin)   |
| `iat`    | Timestamp de emissão (Issued At)    |
| `exp`    | Timestamp de expiração (Expiration) |

### Como Usar o Token

**Header em todas as requisições autenticadas:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Interceptor Axios (recomendado):**

```javascript
// Configurar interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tratar erro 401 (token expirado)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Tentar renovar token
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("/api/auth/refresh", {
          refreshToken,
        });

        localStorage.setItem("token", response.data.data.token);

        // Repetir requisição original
        error.config.headers.Authorization = `Bearer ${response.data.data.token}`;
        return axios.request(error.config);
      } catch (refreshError) {
        // Refresh falhou, redirecionar para login
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 🔒 Segurança

### Boas Práticas Implementadas

✅ **Senhas:**

- Criptografadas com bcrypt (nunca armazenadas em plain text)
- Validação de força (mínimo 8 caracteres, complexidade)
- Salt rounds: 10

✅ **Tokens:**

- JWT assinados com secret forte
- Expiração configurável (default: 24h para access, 7d para refresh)
- Refresh token separado

✅ **Rate Limiting:**

- Login: máximo 5 tentativas por 15 minutos
- Registro: máximo 3 contas por IP por hora
- Recuperação de senha: 1 email por 10 minutos

✅ **Proteções:**

- CORS configurado
- Helmet para headers de segurança
- Validação de entrada com Joi/Yup
- SQL Injection prevenido (ORM)

### Recomendações para Frontend

❌ **Nunca:**

- Armazenar senhas no localStorage/sessionStorage
- Expor tokens em logs ou console
- Enviar tokens via URL/query params

✅ **Sempre:**

- Usar HTTPS em produção
- Limpar tokens ao fazer logout
- Implementar auto-refresh de token
- Validar expiração do token antes de usar

---

## 🔗 Relacionados

- [API de Usuários](./users.md)
- [Middleware de Autenticação](../guides/authentication.md)
- [Configuração JWT](../guides/configuration.md)

---

**Última atualização:** Dezembro 2025
