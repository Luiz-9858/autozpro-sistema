# 🛠️ Guia de Instalação - Backend

Guia completo e detalhado para configurar o ambiente de desenvolvimento do backend do AutozPro.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### Obrigatórios

#### 1. Node.js (>= 18.0.0)

**Verificar instalação:**

```bash
node --version
# Deve retornar: v18.x.x ou superior
```

**Como instalar:**

- **Windows/Mac:** Baixe em [nodejs.org](https://nodejs.org)
- **Linux (Ubuntu/Debian):**

```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
```

#### 2. npm (vem com Node.js)

**Verificar instalação:**

```bash
npm --version
# Deve retornar: 9.x.x ou superior
```

#### 3. PostgreSQL (>= 14.0) ou MySQL (>= 8.0)

**PostgreSQL - Recomendado**

**Verificar instalação:**

```bash
psql --version
# Deve retornar: psql (PostgreSQL) 14.x ou superior
```

**Como instalar:**

- **Windows:** Baixe em [postgresql.org/download](https://www.postgresql.org/download/windows/)
- **Mac (via Homebrew):**

```bash
  brew install postgresql@14
  brew services start postgresql@14
```

- **Linux (Ubuntu/Debian):**

```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
```

**Configurar PostgreSQL:**

```bash
# Acessar o PostgreSQL
sudo -u postgres psql

# Criar usuário
CREATE USER autopecas_user WITH PASSWORD 'sua_senha_aqui';

# Criar banco de dados
CREATE DATABASE autopecas_db;

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE autopecas_db TO autopecas_user;

# Sair
\q
```

---

### Opcionais (Recomendados)

#### 4. Git

**Verificar instalação:**

```bash
git --version
```

**Como instalar:**

- **Windows:** [git-scm.com](https://git-scm.com/download/win)
- **Mac:** `brew install git`
- **Linux:** `sudo apt install git`

#### 5. Postman ou Insomnia

Para testar as rotas da API.

- **Postman:** [postman.com/downloads](https://www.postman.com/downloads/)
- **Insomnia:** [insomnia.rest/download](https://insomnia.rest/download)

#### 6. VS Code (Editor recomendado)

- [code.visualstudio.com](https://code.visualstudio.com/)

**Extensões recomendadas:**

- ESLint
- Prettier
- Prisma (se usar Prisma)
- Thunder Client (testar API direto no VS Code)

---

## 📥 Instalação Passo a Passo

### Passo 1: Clonar o Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/autozpro-sistema.git

# Entre na pasta do projeto
cd autozpro-sistema

# Entre na pasta do backend
cd backend
```

**Se não tiver Git:** Baixe o ZIP do repositório e extraia.

---

### Passo 2: Instalar Dependências

```bash
# Usando npm
npm install

# OU usando yarn (se preferir)
yarn install
```

**Aguarde a instalação...** ☕

**Resultado esperado:**

```
added 150 packages, and audited 151 packages in 15s
```

---

### Passo 3: Configurar Variáveis de Ambiente

#### 3.1 - Copiar arquivo de exemplo

```bash
# Copiar .env.example para .env
cp .env.example .env
```

**No Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**No Windows (CMD):**

```cmd
copy .env.example .env
```

#### 3.2 - Editar o arquivo `.env`

Abra o arquivo `.env` no editor e configure:

```env
# ===== SERVIDOR =====
PORT=3000
NODE_ENV=development

# ===== BANCO DE DADOS =====
# PostgreSQL
DATABASE_URL="postgresql://autopecas_user:sua_senha_aqui@localhost:5432/autopecas_db"

# MySQL (alternativa)
# DATABASE_URL="mysql://usuario:senha@localhost:3306/autopecas_db"

# ===== JWT (IMPORTANTE!) =====
# Gere um secret forte: openssl rand -base64 32
JWT_SECRET=seu_secret_super_secreto_e_complexo_aqui_12345
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# ===== CORS =====
# Adicione a URL do seu frontend
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ===== UPLOAD DE ARQUIVOS =====
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# ===== EMAIL (Opcional - configure depois) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu@email.com
SMTP_PASS=sua_senha_ou_app_password

# ===== PAGAMENTO (Opcional - configure depois) =====
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-...

# ===== CORREIOS (Opcional) =====
CORREIOS_USER=seu_usuario
CORREIOS_PASSWORD=sua_senha
```

**⚠️ IMPORTANTE:**

- Nunca commite o arquivo `.env` no Git!
- Troque `JWT_SECRET` por algo único e forte
- Ajuste `DATABASE_URL` com suas credenciais

**Gerar JWT_SECRET forte:**

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js (em qualquer sistema)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### Passo 4: Configurar Banco de Dados

#### 4.1 - Se usar Prisma (Recomendado)

**Gerar client do Prisma:**

```bash
npx prisma generate
```

**Executar migrations:**

```bash
npx prisma migrate dev
```

**Resultado esperado:**

```
✔ Generated Prisma Client
✔ The migration has been created successfully
✔ Applied 1 migration(s)
```

**Visualizar banco (opcional):**

```bash
npx prisma studio
```

Abre interface visual em `http://localhost:5555`

#### 4.2 - Se usar migrations SQL manuais

```bash
# Execute o arquivo SQL de criação do banco
psql -U autopecas_user -d autopecas_db -f prisma/schema.sql

# Ou via script
npm run migrate
```

---

### Passo 5: Popular Banco com Dados de Teste (Opcional)

```bash
# Executar seed
npm run seed

# OU com Prisma
npx prisma db seed
```

**Isso cria:**

- ✅ Usuário admin padrão
- ✅ Categorias de exemplo
- ✅ Produtos de exemplo
- ✅ Dados de teste

**Credenciais padrão (se houver seed):**

```
Email: admin@autopecas.com
Senha: Admin123!
```

---

### Passo 6: Iniciar o Servidor

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# OU modo produção
npm start
```

**Resultado esperado:**

```
🚀 Servidor rodando na porta 3000
📊 Banco conectado com sucesso!
🔗 http://localhost:3000
```

---

## ✅ Verificação da Instalação

### Teste 1: Servidor está rodando?

Abra o navegador e acesse:

```
http://localhost:3000
```

**Deve retornar:**

```json
{
  "message": "AutozPro API está rodando!",
  "version": "1.0.0"
}
```

### Teste 2: Banco está conectado?

```bash
# Via Prisma
npx prisma studio

# Via SQL direto
psql -U autopecas_user -d autopecas_db -c "SELECT NOW();"
```

### Teste 3: Rota de teste

**Usando cURL:**

```bash
curl http://localhost:3000/api/health
```

**Usando navegador:**

```
http://localhost:3000/api/health
```

**Resposta esperada:**

```json
{
  "success": true,
  "message": "API está funcionando!",
  "timestamp": "2024-12-20T15:30:00.000Z"
}
```

### Teste 4: Criar usuário (Registro)

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@teste.com",
    "senha": "Senha123!",
    "cpf": "123.456.789-00",
    "telefone": "(11) 98765-4321"
  }'
```

**Resposta esperada:**

```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@teste.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🐛 Problemas Comuns

### Erro: "ECONNREFUSED 127.0.0.1:5432"

**Problema:** PostgreSQL não está rodando.

**Solução:**

```bash
# Linux
sudo systemctl start postgresql
sudo systemctl status postgresql

# Mac
brew services start postgresql@14

# Windows
# Abra "Serviços" e inicie "PostgreSQL"
```

---

### Erro: "JWT_SECRET is not defined"

**Problema:** Variável de ambiente não configurada.

**Solução:**

1. Verifique se o arquivo `.env` existe
2. Verifique se `JWT_SECRET` está definido
3. Reinicie o servidor

---

### Erro: "Port 3000 is already in use"

**Problema:** Porta já está sendo usada por outro processo.

**Solução 1 - Mudar porta:**

```env
# No .env, mude para outra porta
PORT=3001
```

**Solução 2 - Matar processo:**

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Erro: "prisma command not found"

**Problema:** Prisma não foi instalado.

**Solução:**

```bash
npm install prisma @prisma/client --save-dev
```

---

### Erro: "Migration failed"

**Problema:** Banco de dados não está limpo ou há conflito.

**Solução:**

```bash
# Resetar banco (CUIDADO: apaga todos os dados!)
npx prisma migrate reset

# Ou criar novo banco e rodar migrations
npx prisma migrate dev
```

---

### Erro ao importar módulos (ES Modules)

**Problema:** Configuração de modules incorreta.

**Solução:**
Adicione no `package.json`:

```json
{
  "type": "module"
}
```

Ou use CommonJS (`require` ao invés de `import`).

---

## 📂 Estrutura Final

Após instalação, sua pasta backend deve estar assim:

```
backend/
├── node_modules/          ✅ Dependências instaladas
├── prisma/
│   ├── migrations/        ✅ Migrations criadas
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── ...
├── uploads/               ✅ Pasta de uploads
├── .env                   ✅ Variáveis configuradas
├── .env.example
├── package.json
└── package-lock.json
```

---

## 🎉 Próximos Passos

Agora que o backend está instalado:

1. ✅ [Configure as rotas da API](../api/)
2. ✅ [Importe a collection no Postman](../examples/postman-collection.json)
3. ✅ [Entenda as regras de negócio](./business-rules.md)
4. ✅ [Configure o frontend](../../frontend/guides/installation.md)

---

## 📞 Precisa de Ajuda?

Se encontrou algum problema não listado aqui:

- Abra uma issue no GitHub
- Consulte a [documentação completa](../)
- Entre em contato: [luizfernandodev16@gmail.com]

---

**Última atualização:** Dezembro 2025
