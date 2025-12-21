# ⚙️ Guia de Configuração - Backend

Documentação completa de todas as variáveis de ambiente e configurações do backend.

---

## 📋 Visão Geral

O backend utiliza variáveis de ambiente para configuração, permitindo diferentes configurações para desenvolvimento, testes e produção sem alterar o código.

**Arquivo principal:** `.env` (na raiz do backend)

⚠️ **IMPORTANTE:**

- Nunca commite o arquivo `.env` no Git!
- Use `.env.example` como template
- Mantenha senhas e secrets em segredo

---

## 📄 Arquivo .env.example

Template base (sempre mantenha atualizado):

```env
# ===== SERVIDOR =====
PORT=3000
NODE_ENV=development

# ===== BANCO DE DADOS =====
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco"

# ===== JWT =====
JWT_SECRET=seu_secret_super_secreto_aqui
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# ===== CORS =====
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ===== UPLOAD =====
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# ===== EMAIL (Opcional) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# ===== PAGAMENTO (Opcional) =====
STRIPE_SECRET_KEY=
MERCADOPAGO_ACCESS_TOKEN=

# ===== CORREIOS (Opcional) =====
CORREIOS_USER=
CORREIOS_PASSWORD=
```

---

## 🔧 Variáveis Obrigatórias

### 1. PORT

**Descrição:** Porta em que o servidor irá rodar.

**Tipo:** Number

**Padrão:** `3000`

**Exemplo:**

```env
PORT=3000
```

**Uso no código:**

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

---

### 2. NODE_ENV

**Descrição:** Ambiente de execução da aplicação.

**Tipo:** String

**Valores possíveis:**

- `development` - Desenvolvimento local
- `production` - Produção
- `test` - Testes automatizados

**Padrão:** `development`

**Exemplo:**

```env
NODE_ENV=development
```

**Impacto:**

- Em `development`: Logs detalhados, CORS mais permissivo, stack traces completas
- Em `production`: Logs mínimos, segurança reforçada, otimizações ativadas

**Uso no código:**

```javascript
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
```

---

### 3. DATABASE_URL

**Descrição:** String de conexão com o banco de dados.

**Tipo:** String (URL)

**Formato PostgreSQL:**

```
postgresql://[usuario]:[senha]@[host]:[porta]/[nome_banco]?schema=[schema]
```

**Formato MySQL:**

```
mysql://[usuario]:[senha]@[host]:[porta]/[nome_banco]
```

**Exemplos:**

**PostgreSQL local:**

```env
DATABASE_URL="postgresql://autopecas_user:SenhaForte123@localhost:5432/autopecas_db"
```

**PostgreSQL remoto (Render, Railway, etc):**

```env
DATABASE_URL="postgresql://user:pass@dpg-xxxxx.oregon-postgres.render.com/dbname"
```

**MySQL local:**

```env
DATABASE_URL="mysql://root:senha@localhost:3306/autopecas_db"
```

**⚠️ Atenção:**

- Use aspas duplas ao redor da URL
- Encode caracteres especiais na senha (ex: `@` vira `%40`)
- Para Prisma, adicione `?schema=public` se necessário

**Verificar conexão:**

```bash
# Com Prisma
npx prisma db pull

# Com psql direto
psql "postgresql://user:pass@host:port/db"
```

---

### 4. JWT_SECRET

**Descrição:** Chave secreta para assinar tokens JWT.

**Tipo:** String

**Requisitos:**

- Mínimo 32 caracteres
- Complexa e única
- Nunca compartilhar ou expor

**Como gerar:**

**Opção 1 - OpenSSL (Linux/Mac):**

```bash
openssl rand -base64 32
```

**Opção 2 - Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Opção 3 - Online (use com cuidado):**
[randomkeygen.com](https://randomkeygen.com/)

**Exemplo:**

```env
JWT_SECRET=Xk2p9Lm4Vn8Qw1Er5Ty7Ui0Op3As6Df8Gh2Jk5Lz9
```

**⚠️ CRÍTICO:**

- **Nunca** use valores óbvios como `secret`, `12345`, etc.
- **Nunca** exponha em logs ou código versionado
- **Mude** se houver suspeita de vazamento

---

### 5. JWT_EXPIRES_IN

**Descrição:** Tempo de expiração do token de acesso.

**Tipo:** String (formato time)

**Formatos aceitos:**

- `60` - 60 segundos
- `2m` - 2 minutos
- `1h` - 1 hora
- `24h` - 24 horas
- `7d` - 7 dias

**Recomendações:**

- **Desenvolvimento:** `24h` ou `7d` (mais confortável)
- **Produção:** `15m` a `1h` (mais seguro)

**Exemplo:**

```env
JWT_EXPIRES_IN=24h
```

**Uso no código:**

```javascript
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});
```

---

### 6. JWT_REFRESH_EXPIRES_IN

**Descrição:** Tempo de expiração do refresh token (se implementado).

**Tipo:** String (formato time)

**Recomendação:** `7d` a `30d`

**Exemplo:**

```env
JWT_REFRESH_EXPIRES_IN=7d
```

---

### 7. ALLOWED_ORIGINS

**Descrição:** Origens permitidas para CORS (Cross-Origin Resource Sharing).

**Tipo:** String (lista separada por vírgulas)

**Exemplo:**

```env
# Desenvolvimento
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Produção
ALLOWED_ORIGINS=https://autopecas.com,https://www.autopecas.com,https://app.autopecas.com
```

**⚠️ Importante:**

- **Nunca** use `*` em produção
- Inclua todas as URLs do frontend (com e sem `www`)
- Não adicione `/` no final das URLs

**Uso no código:**

```javascript
import cors from "cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
```

---

## 📁 Variáveis de Upload

### 8. MAX_FILE_SIZE

**Descrição:** Tamanho máximo de arquivo em bytes.

**Tipo:** Number

**Conversões:**

- `1048576` = 1 MB
- `5242880` = 5 MB
- `10485760` = 10 MB

**Exemplo:**

```env
MAX_FILE_SIZE=5242880
```

**Uso no código:**

```javascript
import multer from "multer";

const upload = multer({
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE),
  },
});
```

---

### 9. UPLOAD_DIR

**Descrição:** Diretório para salvar arquivos enviados.

**Tipo:** String (caminho)

**Exemplo:**

```env
UPLOAD_DIR=./uploads
```

**Alternativas:**

- `./uploads` - Relativo à raiz do backend
- `/var/www/uploads` - Caminho absoluto
- Em produção, use serviços como AWS S3, Cloudinary

---

## 📧 Variáveis de Email (Opcional)

### 10. SMTP_HOST

**Descrição:** Servidor SMTP para envio de emails.

**Tipo:** String

**Exemplos comuns:**

```env
# Gmail
SMTP_HOST=smtp.gmail.com

# Outlook
SMTP_HOST=smtp-mail.outlook.com

# SendGrid
SMTP_HOST=smtp.sendgrid.net

# Mailtrap (testes)
SMTP_HOST=smtp.mailtrap.io
```

---

### 11. SMTP_PORT

**Descrição:** Porta do servidor SMTP.

**Tipo:** Number

**Portas comuns:**

- `587` - TLS (recomendado)
- `465` - SSL
- `25` - Não criptografado (não recomendado)

**Exemplo:**

```env
SMTP_PORT=587
```

---

### 12. SMTP_USER

**Descrição:** Usuário/email para autenticação SMTP.

**Tipo:** String

**Exemplo:**

```env
SMTP_USER=noreply@autopecas.com
```

---

### 13. SMTP_PASS

**Descrição:** Senha para autenticação SMTP.

**Tipo:** String

**⚠️ Gmail:** Use "App Password", não sua senha normal

- Acesse: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Gere uma senha de app específica

**Exemplo:**

```env
SMTP_PASS=abcd efgh ijkl mnop
```

**Uso no código (com Nodemailer):**

```javascript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

---

## 💳 Variáveis de Pagamento (Opcional)

### 14. STRIPE_SECRET_KEY

**Descrição:** Chave secreta da API do Stripe.

**Tipo:** String

**Onde encontrar:**

- Dashboard Stripe → Developers → API keys

**Exemplo:**

```env
# Testes
STRIPE_SECRET_KEY=sk_test_51Abc123...

# Produção
STRIPE_SECRET_KEY=sk_live_51Abc123...
```

**⚠️ Nunca** exponha a chave `live` publicamente!

---

### 15. STRIPE_WEBHOOK_SECRET

**Descrição:** Secret para validar webhooks do Stripe.

**Tipo:** String

**Onde encontrar:**

- Dashboard Stripe → Developers → Webhooks

**Exemplo:**

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

---

### 16. MERCADOPAGO_ACCESS_TOKEN

**Descrição:** Token de acesso da API do Mercado Pago.

**Tipo:** String

**Onde encontrar:**

- Painel Mercado Pago → Credenciais

**Exemplo:**

```env
# Testes
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-abcdef-xyz...

# Produção
MERCADOPAGO_ACCESS_TOKEN=APP_USR-1234567890-abcdef-xyz...
```

---

## 📦 Variáveis de Correios (Opcional)

### 17. CORREIOS_USER

**Descrição:** Usuário para API dos Correios.

**Tipo:** String

**Exemplo:**

```env
CORREIOS_USER=ECT12345
```

---

### 18. CORREIOS_PASSWORD

**Descrição:** Senha para API dos Correios.

**Tipo:** String

**Exemplo:**

```env
CORREIOS_PASSWORD=senha_correios_123
```

**Nota:** Para usar a API dos Correios, é necessário contrato empresarial.

---

## 🌍 Configuração por Ambiente

### Desenvolvimento (.env.development)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://localhost:5432/autopecas_dev"
JWT_SECRET=dev_secret_change_in_production
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Testes (.env.test)

```env
NODE_ENV=test
PORT=3001
DATABASE_URL="postgresql://localhost:5432/autopecas_test"
JWT_SECRET=test_secret
JWT_EXPIRES_IN=1h
```

### Produção (.env.production)

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://user:pass@prod-server.com:5432/autopecas_prod"
JWT_SECRET=SUPER_SECRET_COMPLEX_KEY_PRODUCTION_123xyz
JWT_EXPIRES_IN=1h
ALLOWED_ORIGINS=https://autopecas.com,https://www.autopecas.com
```

---

## 🔐 Boas Práticas

### ✅ FAÇA

- ✅ Use `.env.example` como documentação
- ✅ Adicione `.env` no `.gitignore`
- ✅ Use secrets fortes e únicos
- ✅ Configure variáveis no serviço de hosting (Render, Railway, etc)
- ✅ Valide variáveis obrigatórias na inicialização do app
- ✅ Use diferentes valores para dev/test/prod

### ❌ NÃO FAÇA

- ❌ Commitar `.env` no Git
- ❌ Compartilhar secrets em chats/emails
- ❌ Usar valores padrão em produção
- ❌ Deixar secrets em logs
- ❌ Hardcodar valores no código

---

## ✅ Validação de Variáveis

Crie um arquivo `src/config/validateEnv.js`:

```javascript
const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "ALLOWED_ORIGINS",
];

export function validateEnv() {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error("❌ Variáveis de ambiente obrigatórias faltando:");
    missing.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  console.log("✅ Todas as variáveis de ambiente configuradas!");
}
```

**Use no `server.js`:**

```javascript
import { validateEnv } from "./config/validateEnv.js";

validateEnv(); // Valida antes de iniciar o servidor
```

---

## 🚀 Deploy - Configuração em Serviços

### Render

1. Dashboard → Environment
2. Adicione cada variável manualmente
3. Não use arquivo `.env`

### Railway

1. Settings → Variables
2. Pode importar de `.env` ou adicionar manualmente

### Heroku

```bash
heroku config:set JWT_SECRET=seu_secret
heroku config:set DATABASE_URL=postgresql://...
```

### Vercel (para serverless)

1. Project Settings → Environment Variables
2. Adicione para Production, Preview, Development

---

## 📞 Troubleshooting

### Erro: "JWT_SECRET is not defined"

**Causa:** Variável não configurada ou `.env` não está sendo lido.

**Solução:**

```javascript
// Adicione no topo do server.js
import dotenv from "dotenv";
dotenv.config();

// Ou
import "dotenv/config";
```

---

### Erro: "Database connection failed"

**Causa:** `DATABASE_URL` incorreta.

**Solução:**

1. Verifique se o banco está rodando
2. Confira usuário, senha, host, porta
3. Teste conexão direta:

```bash
   psql "postgresql://user:pass@host:port/db"
```

---

### CORS bloqueando requisições

**Causa:** Frontend não está em `ALLOWED_ORIGINS`.

**Solução:**
Adicione a URL completa do frontend:

```env
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📚 Recursos Adicionais

- [dotenv - Documentação](https://github.com/motdotla/dotenv)
- [The Twelve-Factor App](https://12factor.net/config)
- [OWASP - Configuration Management](https://owasp.org/www-project-top-ten/)

---

**Última atualização:** Dezembro 2025
