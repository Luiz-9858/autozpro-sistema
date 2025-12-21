# 📦 API - Produtos

Documentação completa dos endpoints de produtos (auto peças).

---

## 📋 Índice

- [Listar Produtos](#listar-produtos)
- [Buscar Produto por ID](#buscar-produto-por-id)
- [Buscar Produto por Código](#buscar-produto-por-código)
- [Criar Produto (Admin)](#criar-produto-admin)
- [Atualizar Produto (Admin)](#atualizar-produto-admin)
- [Deletar Produto (Admin)](#deletar-produto-admin)
- [Upload de Imagens (Admin)](#upload-de-imagens-admin)
- [Produtos em Destaque](#produtos-em-destaque)
- [Produtos com Estoque Baixo (Admin)](#produtos-com-estoque-baixo-admin)
- [Busca Avançada](#busca-avançada)

---

## 🔍 Listar Produtos

Lista todos os produtos com paginação e filtros.

### Endpoint

```
GET /api/products
```

### Autenticação

❌ Não requerida (rota pública)

### Query Parameters

| Parâmetro      | Tipo        | Obrigatório | Descrição                                  | Exemplo                |
| -------------- | ----------- | ----------- | ------------------------------------------ | ---------------------- |
| `page`         | number      | Não         | Número da página (default: 1)              | `?page=2`              |
| `limit`        | number      | Não         | Itens por página (default: 20, max: 100)   | `?limit=50`            |
| `categoria`    | string/uuid | Não         | Filtrar por categoria (nome ou ID)         | `?categoria=filtros`   |
| `veiculo_tipo` | string      | Não         | Filtrar por tipo: `leve` ou `pesado`       | `?veiculo_tipo=pesado` |
| `search`       | string      | Não         | Buscar em nome, código, descrição          | `?search=filtro+óleo`  |
| `preco_min`    | number      | Não         | Preço mínimo                               | `?preco_min=50`        |
| `preco_max`    | number      | Não         | Preço máximo                               | `?preco_max=200`       |
| `marca`        | string      | Não         | Filtrar por marca                          | `?marca=Mann+Filter`   |
| `destaque`     | boolean     | Não         | Apenas produtos em destaque                | `?destaque=true`       |
| `orderBy`      | string      | Não         | Ordenar por: `preco`, `nome`, `created_at` | `?orderBy=preco`       |
| `order`        | string      | Não         | Ordem: `asc` ou `desc` (default: `asc`)    | `?order=desc`          |

### Exemplos de Requisição

**cURL:**

```bash
# Listar primeira página
curl -X GET http://localhost:3000/api/products

# Filtrar veículos pesados
curl -X GET "http://localhost:3000/api/products?veiculo_tipo=pesado"

# Buscar "filtro" e ordenar por preço
curl -X GET "http://localhost:3000/api/products?search=filtro&orderBy=preco&order=asc"

# Categoria específica com paginação
curl -X GET "http://localhost:3000/api/products?categoria=filtros&page=2&limit=10"
```

**JavaScript (Axios):**

```javascript
const response = await axios.get("/api/products", {
  params: {
    veiculo_tipo: "pesado",
    preco_max: 100,
    page: 1,
    limit: 20,
  },
});
```

**JavaScript (Fetch):**

```javascript
const response = await fetch("/api/products?search=filtro&limit=10");
const data = await response.json();
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "codigo": "FILTRO-OL-001",
        "nome": "Filtro de Óleo Motor Diesel",
        "descricao": "Filtro de óleo de alta qualidade para motores diesel de veículos pesados. Compatível com Scania, Volvo e Mercedes.",
        "preco": 45.9,
        "custo": 28.5,
        "estoque": 150,
        "estoque_minimo": 20,
        "categoria": {
          "id": "750e8400-...",
          "nome": "Filtros",
          "slug": "filtros"
        },
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
        "imagem_principal": "https://projeto.supabase.co/storage/v1/object/public/products/filtro-001.jpg",
        "imagens": [
          {
            "id": "img-001",
            "url": "https://projeto.supabase.co/storage/v1/object/public/products/filtro-001.jpg",
            "ordem": 0
          },
          {
            "id": "img-002",
            "url": "https://projeto.supabase.co/storage/v1/object/public/products/filtro-001-lateral.jpg",
            "ordem": 1
          }
        ],
        "ativo": true,
        "destaque": false,
        "created_at": "2024-12-20T10:00:00Z",
        "updated_at": "2024-12-20T10:00:00Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "codigo": "PASTILHA-FR-002",
        "nome": "Pastilha de Freio Dianteira Cerâmica",
        "descricao": "Pastilha de freio cerâmica de alto desempenho para veículos leves.",
        "preco": 120.5,
        "custo": 75.0,
        "estoque": 80,
        "estoque_minimo": 15,
        "categoria": {
          "id": "850e8400-...",
          "nome": "Freios",
          "slug": "freios"
        },
        "veiculo_tipo": "leve",
        "marca": "TRW",
        "peso": 1.2,
        "dimensoes": {
          "altura": 15.0,
          "largura": 10.0,
          "profundidade": 2.5
        },
        "compatibilidade": [
          "Ford Focus 2015-2020",
          "Chevrolet Cruze 2016-2021",
          "Hyundai HB20 2019+"
        ],
        "especificacoes": {
          "material": "Cerâmica",
          "temperatura_max": "650°C"
        },
        "imagem_principal": "https://projeto.supabase.co/storage/v1/object/public/products/pastilha-002.jpg",
        "imagens": [
          {
            "id": "img-003",
            "url": "https://projeto.supabase.co/storage/v1/object/public/products/pastilha-002.jpg",
            "ordem": 0
          }
        ],
        "ativo": true,
        "destaque": true,
        "created_at": "2024-12-19T14:30:00Z",
        "updated_at": "2024-12-20T08:15:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total_pages": 15,
      "total_items": 287,
      "has_previous": false,
      "has_next": true
    },
    "filters_applied": {
      "veiculo_tipo": null,
      "categoria": null,
      "search": null,
      "preco_min": null,
      "preco_max": null
    }
  }
}
```

### Respostas de Erro

**400 - Parâmetros Inválidos:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Parâmetros inválidos",
    "details": [
      {
        "field": "page",
        "message": "Página deve ser um número maior que 0"
      }
    ]
  }
}
```

**500 - Erro Interno:**

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Erro ao buscar produtos"
  }
}
```

---

## 🔎 Buscar Produto por ID

Busca detalhes completos de um produto específico pelo ID.

### Endpoint

```
GET /api/products/:id
```

### Autenticação

❌ Não requerida (rota pública)

### Parâmetros de URL

| Parâmetro | Tipo | Descrição     |
| --------- | ---- | ------------- |
| `id`      | uuid | ID do produto |

### Exemplo de Requisição

**cURL:**

```bash
curl -X GET http://localhost:3000/api/products/550e8400-e29b-41d4-a716-446655440000
```

**JavaScript:**

```javascript
const response = await axios.get(`/api/products/${productId}`);
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "codigo": "FILTRO-OL-001",
    "nome": "Filtro de Óleo Motor Diesel",
    "descricao": "Filtro de óleo de alta qualidade para motores diesel de veículos pesados. Compatível com Scania, Volvo e Mercedes.",
    "preco": 45.9,
    "estoque": 150,
    "categoria": {
      "id": "750e8400-...",
      "nome": "Filtros",
      "slug": "filtros",
      "parent": {
        "id": "parent-id",
        "nome": "Motor"
      }
    },
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
      "pressao_abertura": "1.5 bar",
      "garantia": "12 meses"
    },
    "imagens": [
      {
        "id": "img-001",
        "url": "https://projeto.supabase.co/storage/v1/object/public/products/filtro-001.jpg",
        "ordem": 0
      },
      {
        "id": "img-002",
        "url": "https://projeto.supabase.co/storage/v1/object/public/products/filtro-001-lateral.jpg",
        "ordem": 1
      },
      {
        "id": "img-003",
        "url": "https://projeto.supabase.co/storage/v1/object/public/products/filtro-001-embalagem.jpg",
        "ordem": 2
      }
    ],
    "avaliacoes": {
      "media": 4.5,
      "total": 23,
      "distribuicao": {
        "5": 15,
        "4": 5,
        "3": 2,
        "2": 1,
        "1": 0
      }
    },
    "ativo": true,
    "destaque": false,
    "created_at": "2024-12-20T10:00:00Z",
    "updated_at": "2024-12-20T10:00:00Z"
  }
}
```

### Respostas de Erro

**404 - Produto Não Encontrado:**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Produto não encontrado"
  }
}
```

**400 - ID Inválido:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ID",
    "message": "ID do produto inválido"
  }
}
```

---

## 🔢 Buscar Produto por Código

Busca produto pelo código SKU.

### Endpoint

```
GET /api/products/codigo/:codigo
```

### Autenticação

❌ Não requerida

### Parâmetros de URL

| Parâmetro | Tipo   | Descrição             |
| --------- | ------ | --------------------- |
| `codigo`  | string | Código SKU do produto |

### Exemplo de Requisição

**cURL:**

```bash
curl -X GET http://localhost:3000/api/products/codigo/FILTRO-OL-001
```

### Resposta

Mesma estrutura do endpoint por ID.

---

## ➕ Criar Produto (Admin)

Cria um novo produto no catálogo.

### Endpoint

```
POST /api/products
```

### Autenticação

✅ **Requerida** (Token JWT no header)  
🔒 **Role necessária:** `admin`

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

### Body (JSON)

```json
{
  "codigo": "LAMPADA-H7-003",
  "nome": "Lâmpada Halógena H7 12V 55W",
  "descricao": "Lâmpada halógena de alta luminosidade para faróis automotivos. Compatível com diversos modelos de veículos leves.",
  "preco": 24.9,
  "custo": 15.0,
  "estoque": 200,
  "estoque_minimo": 30,
  "categoria_id": "950e8400-e29b-41d4-a716-446655440003",
  "veiculo_tipo": "leve",
  "marca": "Osram",
  "peso": 0.05,
  "dimensoes": {
    "altura": 8.0,
    "largura": 3.0,
    "profundidade": 3.0
  },
  "compatibilidade": [
    "Volkswagen Gol G5/G6",
    "Fiat Palio 2012+",
    "Chevrolet Onix",
    "Ford Ka 2015+"
  ],
  "especificacoes": {
    "voltagem": "12V",
    "potencia": "55W",
    "temperatura_cor": "3200K",
    "duracao": "500h"
  },
  "imagem_principal": "https://projeto.supabase.co/storage/v1/object/public/products/lampada-003.jpg",
  "ativo": true,
  "destaque": false
}
```

### Validações

| Campo             | Validação                                |
| ----------------- | ---------------------------------------- |
| `codigo`          | String, único, 3-50 caracteres           |
| `nome`            | String, obrigatório, 3-200 caracteres    |
| `descricao`       | String, opcional, até 5000 caracteres    |
| `preco`           | Number, obrigatório, > 0                 |
| `custo`           | Number, opcional, >= 0                   |
| `estoque`         | Integer, obrigatório, >= 0               |
| `estoque_minimo`  | Integer, opcional, >= 0                  |
| `categoria_id`    | UUID válido                              |
| `veiculo_tipo`    | Enum: 'leve' ou 'pesado'                 |
| `marca`           | String, opcional, até 100 caracteres     |
| `peso`            | Number, opcional, > 0                    |
| `dimensoes`       | Object com altura, largura, profundidade |
| `compatibilidade` | Array de strings                         |
| `especificacoes`  | Object (livre)                           |

### Exemplo de Requisição

**cURL:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "LAMPADA-H7-003",
    "nome": "Lâmpada Halógena H7 12V 55W",
    "preco": 24.90,
    "estoque": 200,
    "categoria_id": "950e8400-...",
    "veiculo_tipo": "leve"
  }'
```

**JavaScript:**

```javascript
const response = await axios.post(
  "/api/products",
  {
    codigo: "LAMPADA-H7-003",
    nome: "Lâmpada Halógena H7 12V 55W",
    preco: 24.9,
    estoque: 200,
    categoria_id: "950e8400-...",
    veiculo_tipo: "leve",
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### Resposta de Sucesso (201)

```json
{
  "success": true,
  "message": "Produto criado com sucesso",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440004",
    "codigo": "LAMPADA-H7-003",
    "nome": "Lâmpada Halógena H7 12V 55W",
    "preco": 24.9,
    "estoque": 200,
    "veiculo_tipo": "leve",
    "created_at": "2024-12-20T16:45:00Z"
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
        "field": "preco",
        "message": "Preço deve ser maior que zero"
      },
      {
        "field": "veiculo_tipo",
        "message": "Tipo de veículo deve ser 'leve' ou 'pesado'"
      }
    ]
  }
}
```

**401 - Não Autenticado:**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de autenticação não fornecido"
  }
}
```

**403 - Sem Permissão:**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Acesso negado. Apenas administradores podem criar produtos."
  }
}
```

**409 - Código Duplicado:**

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_CODE",
    "message": "Já existe um produto com este código"
  }
}
```

---

## ✏️ Atualizar Produto (Admin)

Atualiza informações de um produto existente.

### Endpoint

```
PUT /api/products/:id
PATCH /api/products/:id
```

### Autenticação

✅ **Requerida** (Token JWT)  
🔒 **Role:** `admin`

### Parâmetros de URL

| Parâmetro | Tipo | Descrição     |
| --------- | ---- | ------------- |
| `id`      | uuid | ID do produto |

### Body (JSON)

**PUT** - Substitui completamente (todos os campos obrigatórios)  
**PATCH** - Atualização parcial (apenas campos enviados)

```json
{
  "preco": 49.9,
  "estoque": 120,
  "destaque": true
}
```

### Exemplo de Requisição

**cURL (PATCH):**

```bash
curl -X PATCH http://localhost:3000/api/products/550e8400-... \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"preco": 49.90, "estoque": 120}'
```

**JavaScript:**

```javascript
await axios.patch(
  `/api/products/${productId}`,
  {
    preco: 49.9,
    estoque: 120,
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Produto atualizado com sucesso",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "codigo": "FILTRO-OL-001",
    "nome": "Filtro de Óleo Motor Diesel",
    "preco": 49.9,
    "estoque": 120,
    "updated_at": "2024-12-20T17:30:00Z"
  }
}
```

### Respostas de Erro

**404 - Produto Não Encontrado:**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Produto não encontrado"
  }
}
```

---

## 🗑️ Deletar Produto (Admin)

Remove um produto do catálogo.

### Endpoint

```
DELETE /api/products/:id
```

### Autenticação

✅ **Requerida** (Token JWT)  
🔒 **Role:** `admin`

### Parâmetros de URL

| Parâmetro | Tipo | Descrição     |
| --------- | ---- | ------------- |
| `id`      | uuid | ID do produto |

### Exemplo de Requisição

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/products/550e8400-... \
  -H "Authorization: Bearer SEU_TOKEN"
```

**JavaScript:**

```javascript
await axios.delete(`/api/products/${productId}`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Produto deletado com sucesso"
}
```

### Respostas de Erro

**404 - Produto Não Encontrado:**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Produto não encontrado"
  }
}
```

**409 - Produto em Pedidos:**

```json
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE",
    "message": "Não é possível deletar produto que está em pedidos. Desative-o ao invés de deletar.",
    "suggestion": "PATCH /api/products/:id com {\"ativo\": false}"
  }
}
```

---

## 📸 Upload de Imagens (Admin)

Faz upload de imagens para um produto.

### Endpoint

```
POST /api/products/:id/images
```

### Autenticação

✅ **Requerida** (Token JWT)  
🔒 **Role:** `admin`

### Headers

```
Authorization: Bearer TOKEN
Content-Type: multipart/form-data
```

### Body (FormData)

| Campo    | Tipo                | Descrição                         |
| -------- | ------------------- | --------------------------------- |
| `images` | File[]              | Array de arquivos (max 5 por vez) |
| `ordem`  | number[] (opcional) | Ordem de exibição                 |

### Restrições

- Formatos aceitos: JPG, JPEG, PNG, WEBP
- Tamanho máximo: 5MB por imagem
- Máximo de imagens: 10 por produto

### Exemplo de Requisição

**JavaScript (FormData):**

```javascript
const formData = new FormData();
formData.append("images", file1);
formData.append("images", file2);

const response = await axios.post(
  `/api/products/${productId}/images`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
);
```

**cURL:**

```bash
curl -X POST http://localhost:3000/api/products/550e8400-.../images \
  -H "Authorization: Bearer TOKEN" \
  -F "images=@imagem1.jpg" \
  -F "images=@imagem2.jpg"
```

### Resposta de Sucesso (201)

```json
{
  "success": true,
  "message": "2 imagens enviadas com sucesso",
  "data": {
    "images": [
      {
        "id": "img-new-001",
        "url": "https://projeto.supabase.co/storage/v1/object/public/products/550e8400-1.jpg",
        "ordem": 3
      },
      {
        "id": "img-new-002",
        "url": "https://projeto.supabase.co/storage/v1/object/public/products/550e8400-2.jpg",
        "ordem": 4
      }
    ]
  }
}
```

### Respostas de Erro

**400 - Arquivo Inválido:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE",
    "message": "Formato de arquivo não suportado. Use JPG, PNG ou WEBP."
  }
}
```

**413 - Arquivo Muito Grande:**

```json
{
  "success": false,
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "Arquivo excede o tamanho máximo de 5MB"
  }
}
```

---

## ⭐ Produtos em Destaque

Lista produtos marcados como destaque.

### Endpoint

```
GET /api/products/featured
```

### Autenticação

❌ Não requerida

### Query Parameters

| Parâmetro | Tipo   | Descrição                         |
| --------- | ------ | --------------------------------- |
| `limit`   | number | Quantidade (default: 10, max: 50) |

### Exemplo de Requisição

**cURL:**

```bash
curl -X GET "http://localhost:3000/api/products/featured?limit=6"
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "660e8400-...",
        "codigo": "PASTILHA-FR-002",
        "nome": "Pastilha de Freio Dianteira Cerâmica",
        "preco": 120.5,
        "imagem_principal": "https://...",
        "destaque": true
      }
    ],
    "total": 6
  }
}
```

---

## 📉 Produtos com Estoque Baixo (Admin)

Lista produtos com estoque abaixo do mínimo.

### Endpoint

```
GET /api/products/low-stock
```

### Autenticação

✅ **Requerida** (Token JWT)  
🔒 **Role:** `admin`

### Exemplo de Requisição

**cURL:**

```bash
curl -X GET http://localhost:3000/api/products/low-stock \
  -H "Authorization: Bearer TOKEN"
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "...",
        "codigo": "FILTRO-AR-005",
        "nome": "Filtro de Ar Motor",
        "estoque": 5,
        "estoque_minimo": 15,
        "quantidade_necessaria": 10,
        "preco": 35.0
      }
    ],
    "total": 3,
    "alerta": "3 produtos com estoque baixo"
  }
}
```

---

## 🔍 Busca Avançada

Busca com múltiplos critérios e compatibilidade de veículos.

### Endpoint

```
POST /api/products/search
```

### Autenticação

❌ Não requerida

### Body (JSON)

```json
{
  "termo": "filtro",
  "veiculo_tipo": "pesado",
  "categorias": ["filtros", "motor"],
  "marcas": ["Mann Filter", "Bosch"],
  "compativel_com": "Scania R440",
  "preco": {
    "min": 20,
    "max": 100
  },
  "em_estoque": true,
  "page": 1,
  "limit": 20
}
```

### Resposta

Mesma estrutura do endpoint de listagem.

---

## 📊 Estatísticas de Produtos (Admin)

Retorna estatísticas gerais do catálogo.

### Endpoint

```
GET /api/products/stats
```

### Autenticação

✅ **Requerida**  
🔒 **Role:** `admin`

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "data": {
    "total_produtos": 287,
    "produtos_ativos": 275,
    "produtos_inativos": 12,
    "produtos_destaque": 15,
    "estoque_total": 45230,
    "valor_estoque": 1250000.0,
    "produtos_estoque_baixo": 8,
    "categorias_com_produtos": 25,
    "por_veiculo_tipo": {
      "leve": 180,
      "pesado": 107
    },
    "produto_mais_caro": {
      "id": "...",
      "nome": "Kit Embreagem Completo",
      "preco": 2500.0
    },
    "produto_mais_barato": {
      "id": "...",
      "nome": "Parafuso M6x20",
      "preco": 0.5
    }
  }
}
```

---

## 🔗 Relacionados

- [API de Categorias](./categories.md)
- [API de Carrinho](./cart.md)
- [API de Pedidos](./orders.md)
- [Regras de Negócio](../guides/business-rules.md)

---

**Última atualização:** Dezembro 2025
