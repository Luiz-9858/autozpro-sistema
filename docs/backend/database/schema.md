# 🗄️ Schema do Banco de Dados

Documentação completa da estrutura do banco de dados PostgreSQL (Supabase).

---

## 📊 Visão Geral

**Banco de Dados:** PostgreSQL 15.x (Supabase)  
**ORM:** Prisma / Supabase Client  
**Total de Tabelas:** 10+  
**Diagrama ER:** [Ver diagrama completo](../../diagrams/backend/er-diagram.png)

---

## 🔗 Conexão Supabase

### Informações de Conexão

```env
# Connection String (Prisma)
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Supabase URL (Client)
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc... (server-only)
```

### Recursos do Supabase Utilizados

- ✅ **PostgreSQL** - Banco de dados relacional
- ✅ **Supabase Auth** (opcional) - Autenticação
- ✅ **Supabase Storage** - Upload de imagens dos produtos
- ✅ **Row Level Security (RLS)** - Segurança em nível de linha
- ⚠️ **Realtime** (se necessário) - Updates em tempo real

---

## 📋 Lista de Tabelas

| Tabela               | Descrição              | Relacionamentos                       |
| -------------------- | ---------------------- | ------------------------------------- |
| `users`              | Usuários do sistema    | → `cart_items`, `orders`, `addresses` |
| `categories`         | Categorias de produtos | → `products`                          |
| `products`           | Catálogo de auto peças | → `cart_items`, `order_items`         |
| `cart_items`         | Itens no carrinho      | `users` ←, `products` ←               |
| `addresses`          | Endereços de entrega   | `users` ←                             |
| `orders`             | Pedidos realizados     | `users` ←, `addresses` ←              |
| `order_items`        | Itens de cada pedido   | `orders` ←, `products` ←              |
| `product_images`     | Imagens dos produtos   | `products` ←                          |
| `reviews` (opcional) | Avaliações de produtos | `users` ←, `products` ←               |
| `coupons` (opcional) | Cupons de desconto     | -                                     |

---

## 👤 Tabela: users

Armazena informações dos usuários (clientes e administradores).

### Estrutura

| Campo        | Tipo         | Restrições                           | Descrição                      |
| ------------ | ------------ | ------------------------------------ | ------------------------------ |
| `id`         | UUID         | PK, DEFAULT `gen_random_uuid()`      | ID único                       |
| `nome`       | VARCHAR(200) | NOT NULL                             | Nome completo                  |
| `email`      | VARCHAR(255) | UNIQUE, NOT NULL                     | Email (login)                  |
| `senha_hash` | VARCHAR(255) | NOT NULL (se não usar Supabase Auth) | Senha criptografada            |
| `cpf`        | VARCHAR(14)  | UNIQUE                               | CPF formatado                  |
| `telefone`   | VARCHAR(20)  |                                      | Telefone contato               |
| `avatar_url` | TEXT         |                                      | URL da foto (Supabase Storage) |
| `role`       | VARCHAR(20)  | DEFAULT 'customer'                   | 'customer' \| 'admin'          |
| `ativo`      | BOOLEAN      | DEFAULT true                         | Usuário ativo                  |
| `created_at` | TIMESTAMPTZ  | DEFAULT NOW()                        | Data de criação                |
| `updated_at` | TIMESTAMPTZ  | DEFAULT NOW()                        | Última atualização             |

### SQL de Criação

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255), -- Não necessário se usar Supabase Auth
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_role ON users(role);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Policy: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Admins podem ver tudo
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Exemplo de Dados

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "avatar_url": "https://[project].supabase.co/storage/v1/object/public/avatars/user123.jpg",
  "role": "customer",
  "ativo": true,
  "created_at": "2024-12-20T10:00:00Z",
  "updated_at": "2024-12-20T10:00:00Z"
}
```

---

## 📦 Tabela: products

Catálogo completo de auto peças.

### Estrutura

| Campo              | Tipo          | Restrições                      | Descrição                             |
| ------------------ | ------------- | ------------------------------- | ------------------------------------- |
| `id`               | UUID          | PK, DEFAULT `gen_random_uuid()` | ID único                              |
| `codigo`           | VARCHAR(50)   | UNIQUE, NOT NULL                | Código SKU                            |
| `nome`             | VARCHAR(200)  | NOT NULL                        | Nome do produto                       |
| `descricao`        | TEXT          |                                 | Descrição detalhada                   |
| `preco`            | DECIMAL(10,2) | NOT NULL, CHECK > 0             | Preço de venda                        |
| `custo`            | DECIMAL(10,2) |                                 | Custo de aquisição                    |
| `estoque`          | INTEGER       | DEFAULT 0, CHECK >= 0           | Quantidade disponível                 |
| `estoque_minimo`   | INTEGER       | DEFAULT 10                      | Alerta estoque baixo                  |
| `categoria_id`     | UUID          | FK → categories                 | Categoria                             |
| `veiculo_tipo`     | VARCHAR(20)   | NOT NULL                        | 'leve' \| 'pesado'                    |
| `marca`            | VARCHAR(100)  |                                 | Marca da peça                         |
| `peso`             | DECIMAL(8,3)  |                                 | Peso em kg                            |
| `dimensoes`        | JSONB         |                                 | {altura, largura, profundidade} em cm |
| `compatibilidade`  | JSONB         |                                 | Array de veículos compatíveis         |
| `especificacoes`   | JSONB         |                                 | Especificações técnicas               |
| `imagem_principal` | TEXT          |                                 | URL da imagem principal               |
| `ativo`            | BOOLEAN       | DEFAULT true                    | Produto ativo no catálogo             |
| `destaque`         | BOOLEAN       | DEFAULT false                   | Produto em destaque                   |
| `created_at`       | TIMESTAMPTZ   | DEFAULT NOW()                   | Data de criação                       |
| `updated_at`       | TIMESTAMPTZ   | DEFAULT NOW()                   | Última atualização                    |

### SQL de Criação

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
  custo DECIMAL(10,2) CHECK (custo >= 0),
  estoque INTEGER DEFAULT 0 CHECK (estoque >= 0),
  estoque_minimo INTEGER DEFAULT 10,
  categoria_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  veiculo_tipo VARCHAR(20) NOT NULL CHECK (veiculo_tipo IN ('leve', 'pesado')),
  marca VARCHAR(100),
  peso DECIMAL(8,3),
  dimensoes JSONB,
  compatibilidade JSONB,
  especificacoes JSONB,
  imagem_principal TEXT,
  ativo BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_products_codigo ON products(codigo);
CREATE INDEX idx_products_categoria ON products(categoria_id);
CREATE INDEX idx_products_veiculo_tipo ON products(veiculo_tipo);
CREATE INDEX idx_products_ativo ON products(ativo);
CREATE INDEX idx_products_destaque ON products(destaque) WHERE destaque = true;

-- Índice GIN para busca full-text no nome
CREATE INDEX idx_products_nome_gin ON products USING GIN (to_tsvector('portuguese', nome));

-- Índice GIN para busca em JSONB (compatibilidade)
CREATE INDEX idx_products_compatibilidade ON products USING GIN (compatibilidade);

-- Trigger para updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Todos podem visualizar produtos ativos
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (ativo = true);

-- Apenas admins podem inserir/atualizar/deletar
CREATE POLICY "Only admins can modify products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Exemplo de Dados (JSONB)

```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "codigo": "FILTRO-OL-001",
  "nome": "Filtro de Óleo Motor Diesel",
  "descricao": "Filtro de óleo de alta qualidade para motores diesel de veículos pesados",
  "preco": 45.9,
  "custo": 28.5,
  "estoque": 150,
  "estoque_minimo": 20,
  "categoria_id": "750e8400-...",
  "veiculo_tipo": "pesado",
  "marca": "Mann Filter",
  "peso": 0.45,
  "dimensoes": {
    "altura": 12.5,
    "largura": 8.0,
    "profundidade": 8.0
  },
  "compatibilidade": [
    "Scania R440",
    "Scania R500",
    "Volvo FH 440",
    "Mercedes Actros 2546"
  ],
  "especificacoes": {
    "tipo": "Spin-on",
    "rosca": "M20 x 1.5",
    "pressao_abertura": "1.5 bar"
  },
  "imagem_principal": "https://[project].supabase.co/storage/v1/object/public/products/filtro-001.jpg",
  "ativo": true,
  "destaque": false
}
```

---

## 🗂️ Tabela: categories

Categorias de produtos (estrutura hierárquica).

### Estrutura

| Campo        | Tipo         | Restrições       | Descrição                    |
| ------------ | ------------ | ---------------- | ---------------------------- |
| `id`         | UUID         | PK               | ID único                     |
| `nome`       | VARCHAR(100) | UNIQUE, NOT NULL | Nome da categoria            |
| `slug`       | VARCHAR(100) | UNIQUE, NOT NULL | URL amigável                 |
| `descricao`  | TEXT         |                  | Descrição                    |
| `parent_id`  | UUID         | FK → categories  | Categoria pai (subcategoria) |
| `icone`      | VARCHAR(50)  |                  | Nome do ícone                |
| `ordem`      | INTEGER      | DEFAULT 0        | Ordem de exibição            |
| `ativo`      | BOOLEAN      | DEFAULT true     | Categoria ativa              |
| `created_at` | TIMESTAMPTZ  | DEFAULT NOW()    |                              |

### SQL de Criação

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  descricao TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  icone VARCHAR(50),
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
```

### Exemplo de Estrutura Hierárquica

```
🔧 Motor (id: 1)
  ├── 🛢️ Filtros (id: 2, parent_id: 1)
  │   ├── Óleo (id: 3, parent_id: 2)
  │   └── Ar (id: 4, parent_id: 2)
  └── 🔩 Peças Internas (id: 5, parent_id: 1)

🚗 Freios (id: 6)
  ├── Pastilhas (id: 7, parent_id: 6)
  └── Discos (id: 8, parent_id: 6)
```

---

## 🛒 Tabela: cart_items

Itens no carrinho de compras de cada usuário.

### Estrutura

| Campo            | Tipo          | Restrições              | Descrição        |
| ---------------- | ------------- | ----------------------- | ---------------- |
| `id`             | UUID          | PK                      | ID único         |
| `user_id`        | UUID          | FK → users, NOT NULL    | Dono do carrinho |
| `produto_id`     | UUID          | FK → products, NOT NULL | Produto          |
| `quantidade`     | INTEGER       | CHECK > 0               | Quantidade       |
| `preco_unitario` | DECIMAL(10,2) | NOT NULL                | Preço no momento |
| `created_at`     | TIMESTAMPTZ   | DEFAULT NOW()           |                  |
| `updated_at`     | TIMESTAMPTZ   | DEFAULT NOW()           |                  |

### SQL de Criação

```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, produto_id) -- Um produto por usuário no carrinho
);

CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_produto ON cart_items(produto_id);

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### RLS Policies

```sql
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Usuários só veem seu próprio carrinho
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários só modificam seu próprio carrinho
CREATE POLICY "Users can modify own cart"
  ON cart_items FOR ALL
  USING (auth.uid() = user_id);
```

---

## 📍 Tabela: addresses

Endereços de entrega dos usuários.

### Estrutura

| Campo         | Tipo         | Restrições       | Descrição          |
| ------------- | ------------ | ---------------- | ------------------ |
| `id`          | UUID         | PK               | ID único           |
| `user_id`     | UUID         | FK → users       | Dono do endereço   |
| `apelido`     | VARCHAR(50)  |                  | "Casa", "Trabalho" |
| `cep`         | VARCHAR(9)   | NOT NULL         | CEP formatado      |
| `logradouro`  | VARCHAR(200) | NOT NULL         | Rua/Avenida        |
| `numero`      | VARCHAR(20)  | NOT NULL         | Número             |
| `complemento` | VARCHAR(100) |                  | Apto, bloco, etc   |
| `bairro`      | VARCHAR(100) | NOT NULL         | Bairro             |
| `cidade`      | VARCHAR(100) | NOT NULL         | Cidade             |
| `estado`      | VARCHAR(2)   | NOT NULL         | UF                 |
| `pais`        | VARCHAR(50)  | DEFAULT 'Brasil' | País               |
| `padrao`      | BOOLEAN      | DEFAULT false    | Endereço padrão    |
| `created_at`  | TIMESTAMPTZ  | DEFAULT NOW()    |                    |

### SQL de Criação

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  apelido VARCHAR(50),
  cep VARCHAR(9) NOT NULL,
  logradouro VARCHAR(200) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  complemento VARCHAR(100),
  bairro VARCHAR(100) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL CHECK (length(estado) = 2),
  pais VARCHAR(50) DEFAULT 'Brasil',
  padrao BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_cep ON addresses(cep);

-- Garantir apenas um endereço padrão por usuário
CREATE UNIQUE INDEX idx_addresses_user_padrao
  ON addresses(user_id)
  WHERE padrao = true;
```

### RLS Policies

```sql
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);
```

---

## 📋 Tabela: orders

Pedidos realizados pelos clientes.

### Estrutura

| Campo                 | Tipo          | Restrições         | Descrição                          |
| --------------------- | ------------- | ------------------ | ---------------------------------- |
| `id`                  | UUID          | PK                 | ID único                           |
| `numero`              | VARCHAR(50)   | UNIQUE             | PED-2024-00001                     |
| `user_id`             | UUID          | FK → users         | Cliente                            |
| `status`              | VARCHAR(20)   | DEFAULT 'pendente' | Status do pedido                   |
| `subtotal`            | DECIMAL(10,2) | NOT NULL           | Soma dos itens                     |
| `desconto`            | DECIMAL(10,2) | DEFAULT 0          | Valor de desconto                  |
| `frete`               | DECIMAL(10,2) | DEFAULT 0          | Valor do frete                     |
| `total`               | DECIMAL(10,2) | NOT NULL           | Total a pagar                      |
| `metodo_pagamento`    | VARCHAR(20)   |                    | 'credit_card' \| 'pix' \| 'boleto' |
| `status_pagamento`    | VARCHAR(20)   | DEFAULT 'pendente' | Status pagamento                   |
| `endereco_entrega_id` | UUID          | FK → addresses     | Endereço de entrega                |
| `observacoes`         | TEXT          |                    | Observações do cliente             |
| `data_pagamento`      | TIMESTAMPTZ   |                    | Data confirmação pagamento         |
| `data_envio`          | TIMESTAMPTZ   |                    | Data de envio                      |
| `data_entrega`        | TIMESTAMPTZ   |                    | Data de entrega                    |
| `codigo_rastreio`     | VARCHAR(100)  |                    | Código rastreamento                |
| `created_at`          | TIMESTAMPTZ   | DEFAULT NOW()      |                                    |
| `updated_at`          | TIMESTAMPTZ   | DEFAULT NOW()      |                                    |

### SQL de Criação

```sql
CREATE TYPE order_status AS ENUM (
  'pendente',
  'pago',
  'separacao',
  'enviado',
  'entregue',
  'cancelado'
);

CREATE TYPE payment_status AS ENUM (
  'pendente',
  'processando',
  'aprovado',
  'recusado',
  'estornado'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  status order_status DEFAULT 'pendente',
  subtotal DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  frete DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  metodo_pagamento VARCHAR(20),
  status_pagamento payment_status DEFAULT 'pendente',
  endereco_entrega_id UUID REFERENCES addresses(id),
  observacoes TEXT,
  data_pagamento TIMESTAMPTZ,
  data_envio TIMESTAMPTZ,
  data_entrega TIMESTAMPTZ,
  codigo_rastreio VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_numero ON orders(numero);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function para gerar número do pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.numero := 'PED-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.numero IS NULL)
  EXECUTE FUNCTION generate_order_number();
```

### RLS Policies

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Usuários veem apenas seus pedidos
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Admins veem tudo
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 📦 Tabela: order_items

Itens de cada pedido.

### Estrutura

| Campo            | Tipo          | Restrições    | Descrição                    |
| ---------------- | ------------- | ------------- | ---------------------------- |
| `id`             | UUID          | PK            | ID único                     |
| `order_id`       | UUID          | FK → orders   | Pedido                       |
| `produto_id`     | UUID          | FK → products | Produto                      |
| `quantidade`     | INTEGER       | NOT NULL      | Quantidade                   |
| `preco_unitario` | DECIMAL(10,2) | NOT NULL      | Preço no momento             |
| `subtotal`       | DECIMAL(10,2) | NOT NULL      | quantidade \* preco_unitario |

### SQL de Criação

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES products(id),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_produto ON order_items(produto_id);

-- Trigger para calcular subtotal automaticamente
CREATE OR REPLACE FUNCTION calculate_order_item_subtotal()
RETURNS TRIGGER AS $$
BEGIN
  NEW.subtotal := NEW.quantidade * NEW.preco_unitario;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_item_subtotal
  BEFORE INSERT OR UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION calculate_order_item_subtotal();
```

---

## 📸 Tabela: product_images (Supabase Storage)

Armazena URLs de múltiplas imagens por produto.

### Estrutura

| Campo        | Tipo        | Restrições    | Descrição                         |
| ------------ | ----------- | ------------- | --------------------------------- |
| `id`         | UUID        | PK            | ID único                          |
| `produto_id` | UUID        | FK → products | Produto                           |
| `url`        | TEXT        | NOT NULL      | URL da imagem no Supabase Storage |
| `ordem`      | INTEGER     | DEFAULT 0     | Ordem de exibição                 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() |                                   |

### SQL de Criação

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_product_images_produto ON product_images(produto_id);
CREATE INDEX idx_product_images_ordem ON product_images(produto_id, ordem);
```

### Configuração Supabase Storage

**Bucket:** `products`

**Policies:**

```sql
-- Permitir leitura pública
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Apenas admins podem fazer upload
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 📊 Views Úteis

### View: produtos_com_estoque_baixo

```sql
CREATE VIEW produtos_com_estoque_baixo AS
SELECT
  id,
  codigo,
  nome,
  estoque,
  estoque_minimo,
  (estoque_minimo - estoque) as quantidade_necessaria
FROM products
WHERE estoque <= estoque_minimo
  AND ativo = true
ORDER BY estoque ASC;
```

### View: vendas_por_produto

```sql
CREATE VIEW vendas_por_produto AS
SELECT
  p.id,
  p.codigo,
  p.nome,
  COUNT(DISTINCT oi.order_id) as total_pedidos,
  SUM(oi.quantidade) as total_vendido,
  SUM(oi.subtotal) as receita_total
FROM products p
LEFT JOIN order_items oi ON p.id = oi.produto_id
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('pago', 'enviado', 'entregue')
GROUP BY p.id, p.codigo, p.nome
ORDER BY total_vendido DESC;
```

---

## 🔄 Migrations

### Histórico de Migrations (Supabase)

Execute migrations via:

**Opção 1 - Supabase Dashboard:**

- SQL Editor → New query → Cole o SQL → Run

**Opção 2 - Supabase CLI:**

```bash
supabase migration new create_users_table
# Edite o arquivo gerado
supabase db push
```

**Opção 3 - Prisma (se usar):**

```bash
npx prisma migrate dev --name init
npx prisma db push
```

---

## 📈 Estatísticas do Banco

### Espaço Utilizado

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Contagem de Registros

```sql
SELECT
  'users' as tabela, COUNT(*) FROM users
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;
```

---

## 🔐 Backup e Restore (Supabase)

### Backup Manual

Via Supabase Dashboard:

- Project Settings → Database → Database backups
- Ou use pg_dump:

```bash
pg_dump -h db.[project-ref].supabase.co \
  -U postgres \
  -d postgres \
  -f backup.sql
```

### Restore

```bash
psql -h db.[project-ref].supabase.co \
  -U postgres \
  -d postgres \
  -f backup.sql
```

---

## 📚 Recursos Adicionais

- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Última atualização:** Dezembro 2025
