# 🛒 API - Carrinho de Compras

Documentação completa dos endpoints do carrinho de compras.

---

## 📋 Índice

- [Ver Carrinho](#ver-carrinho)
- [Adicionar Item ao Carrinho](#adicionar-item-ao-carrinho)
- [Atualizar Quantidade](#atualizar-quantidade)
- [Remover Item](#remover-item)
- [Limpar Carrinho](#limpar-carrinho)
- [Calcular Total](#calcular-total)
- [Validar Estoque](#validar-estoque)

---

## 🛒 Ver Carrinho

Retorna todos os itens do carrinho do usuário logado.

### Endpoint

```
GET /api/cart
```

### Autenticação

✅ **Requerida** (Token JWT)

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Exemplo de Requisição

**cURL:**

```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer SEU_TOKEN"
```

**JavaScript:**

```javascript
const response = await axios.get("/api/cart", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart-item-001",
        "produto_id": "550e8400-e29b-41d4-a716-446655440000",
        "produto": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "codigo": "FILTRO-OL-001",
          "nome": "Filtro de Óleo Motor Diesel",
          "imagem_principal": "https://projeto.supabase.co/storage/v1/object/public/products/filtro-001.jpg",
          "preco": 45.9,
          "estoque": 150,
          "veiculo_tipo": "pesado"
        },
        "quantidade": 2,
        "preco_unitario": 45.9,
        "subtotal": 91.8,
        "created_at": "2024-12-20T10:00:00Z",
        "updated_at": "2024-12-20T10:00:00Z"
      },
      {
        "id": "cart-item-002",
        "produto_id": "660e8400-e29b-41d4-a716-446655440001",
        "produto": {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "codigo": "PASTILHA-FR-002",
          "nome": "Pastilha de Freio Dianteira Cerâmica",
          "imagem_principal": "https://projeto.supabase.co/storage/v1/object/public/products/pastilha-002.jpg",
          "preco": 120.5,
          "estoque": 80,
          "veiculo_tipo": "leve"
        },
        "quantidade": 1,
        "preco_unitario": 120.5,
        "subtotal": 120.5,
        "created_at": "2024-12-20T11:30:00Z",
        "updated_at": "2024-12-20T11:30:00Z"
      }
    ],
    "resumo": {
      "total_items": 2,
      "quantidade_total": 3,
      "subtotal": 212.3,
      "peso_total": 1.65,
      "necessita_calculo_frete": true
    }
  }
}
```

### Resposta - Carrinho Vazio (200)

```json
{
  "success": true,
  "data": {
    "items": [],
    "resumo": {
      "total_items": 0,
      "quantidade_total": 0,
      "subtotal": 0,
      "peso_total": 0,
      "necessita_calculo_frete": false
    }
  },
  "message": "Seu carrinho está vazio"
}
```

---

## ➕ Adicionar Item ao Carrinho

Adiciona um produto ao carrinho ou incrementa a quantidade se já existir.

### Endpoint

```
POST /api/cart/items
```

### Autenticação

✅ **Requerida** (Token JWT)

### Headers

```
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Body (JSON)

```json
{
  "produto_id": "550e8400-e29b-41d4-a716-446655440000",
  "quantidade": 2
}
```

### Validações

| Campo        | Validação                                        |
| ------------ | ------------------------------------------------ |
| `produto_id` | UUID válido, obrigatório                         |
| `quantidade` | Integer, obrigatório, > 0, <= estoque disponível |

### Regras de Negócio

- Se o produto já está no carrinho, **soma** a quantidade
- Verifica se há estoque suficiente
- Captura o preço atual do produto (não o preço histórico)
- Máximo de 100 unidades do mesmo produto no carrinho

### Exemplo de Requisição

**cURL:**

```bash
curl -X POST http://localhost:3000/api/cart/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "produto_id": "550e8400-e29b-41d4-a716-446655440000",
    "quantidade": 2
  }'
```

**JavaScript:**

```javascript
const response = await axios.post(
  "/api/cart/items",
  {
    produto_id: productId,
    quantidade: 2,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### Resposta de Sucesso (201)

**Produto adicionado pela primeira vez:**

```json
{
  "success": true,
  "message": "Produto adicionado ao carrinho com sucesso",
  "data": {
    "id": "cart-item-003",
    "produto_id": "550e8400-e29b-41d4-a716-446655440000",
    "quantidade": 2,
    "preco_unitario": 45.9,
    "subtotal": 91.8,
    "produto": {
      "nome": "Filtro de Óleo Motor Diesel",
      "imagem_principal": "https://..."
    }
  }
}
```

**Produto já existia (quantidade atualizada):**

```json
{
  "success": true,
  "message": "Quantidade atualizada no carrinho",
  "data": {
    "id": "cart-item-001",
    "produto_id": "550e8400-e29b-41d4-a716-446655440000",
    "quantidade": 4,
    "preco_unitario": 45.9,
    "subtotal": 183.6,
    "antiga_quantidade": 2
  }
}
```

### Respostas de Erro

**404 - Produto Não Encontrado:**

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Produto não encontrado"
  }
}
```

**409 - Estoque Insuficiente:**

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Estoque insuficiente. Disponível: 5 unidades",
    "available": 5,
    "requested": 10
  }
}
```

**400 - Produto Inativo:**

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_UNAVAILABLE",
    "message": "Este produto não está mais disponível"
  }
}
```

**400 - Quantidade Máxima Excedida:**

```json
{
  "success": false,
  "error": {
    "code": "MAX_QUANTITY_EXCEEDED",
    "message": "Quantidade máxima permitida: 100 unidades por produto"
  }
}
```

---

## ✏️ Atualizar Quantidade

Atualiza a quantidade de um item específico no carrinho.

### Endpoint

```
PATCH /api/cart/items/:id
PUT /api/cart/items/:id
```

### Autenticação

✅ **Requerida** (Token JWT)

### Parâmetros de URL

| Parâmetro | Tipo | Descrição              |
| --------- | ---- | ---------------------- |
| `id`      | uuid | ID do item no carrinho |

### Body (JSON)

```json
{
  "quantidade": 5
}
```

### Validações

| Campo        | Validação                             |
| ------------ | ------------------------------------- |
| `quantidade` | Integer, obrigatório, > 0, <= estoque |

### Exemplo de Requisição

**cURL:**

```bash
curl -X PATCH http://localhost:3000/api/cart/items/cart-item-001 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantidade": 5}'
```

**JavaScript:**

```javascript
const response = await axios.patch(
  `/api/cart/items/${itemId}`,
  {
    quantidade: 5,
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
  "message": "Quantidade atualizada com sucesso",
  "data": {
    "id": "cart-item-001",
    "produto_id": "550e8400-e29b-41d4-a716-446655440000",
    "quantidade": 5,
    "quantidade_anterior": 2,
    "preco_unitario": 45.9,
    "subtotal": 229.5
  }
}
```

### Respostas de Erro

**404 - Item Não Encontrado:**

```json
{
  "success": false,
  "error": {
    "code": "CART_ITEM_NOT_FOUND",
    "message": "Item não encontrado no carrinho"
  }
}
```

**409 - Estoque Insuficiente:**

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Estoque insuficiente. Disponível: 3 unidades",
    "available": 3,
    "requested": 5
  }
}
```

---

## 🗑️ Remover Item

Remove um item específico do carrinho.

### Endpoint

```
DELETE /api/cart/items/:id
```

### Autenticação

✅ **Requerida** (Token JWT)

### Parâmetros de URL

| Parâmetro | Tipo | Descrição              |
| --------- | ---- | ---------------------- |
| `id`      | uuid | ID do item no carrinho |

### Exemplo de Requisição

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/cart/items/cart-item-001 \
  -H "Authorization: Bearer TOKEN"
```

**JavaScript:**

```javascript
await axios.delete(`/api/cart/items/${itemId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Item removido do carrinho com sucesso"
}
```

### Respostas de Erro

**404 - Item Não Encontrado:**

```json
{
  "success": false,
  "error": {
    "code": "CART_ITEM_NOT_FOUND",
    "message": "Item não encontrado no carrinho"
  }
}
```

---

## 🧹 Limpar Carrinho

Remove todos os itens do carrinho do usuário.

### Endpoint

```
DELETE /api/cart
```

### Autenticação

✅ **Requerida** (Token JWT)

### Exemplo de Requisição

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/cart \
  -H "Authorization: Bearer TOKEN"
```

**JavaScript:**

```javascript
await axios.delete("/api/cart", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Carrinho limpo com sucesso",
  "data": {
    "items_removidos": 3
  }
}
```

---

## 💰 Calcular Total

Calcula o total do carrinho incluindo subtotal, desconto e frete.

### Endpoint

```
POST /api/cart/calculate
```

### Autenticação

✅ **Requerida** (Token JWT)

### Body (JSON)

```json
{
  "cep_destino": "01310-100",
  "cupom": "PRIMEIRACOMPRA10"
}
```

### Parâmetros

| Campo         | Tipo   | Obrigatório | Descrição                   |
| ------------- | ------ | ----------- | --------------------------- |
| `cep_destino` | string | Sim         | CEP para cálculo de frete   |
| `cupom`       | string | Não         | Código de cupom de desconto |

### Exemplo de Requisição

**JavaScript:**

```javascript
const response = await axios.post(
  "/api/cart/calculate",
  {
    cep_destino: "01310-100",
    cupom: "PRIMEIRACOMPRA10",
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
  "data": {
    "items": 2,
    "quantidade_total": 3,
    "subtotal": 212.3,
    "desconto": {
      "cupom": "PRIMEIRACOMPRA10",
      "tipo": "percentual",
      "valor": 21.23,
      "percentual": 10
    },
    "frete": {
      "cep_origem": "04101-300",
      "cep_destino": "01310-100",
      "valor": 25.0,
      "prazo_dias": 5,
      "servico": "PAC",
      "alternativas": [
        {
          "servico": "SEDEX",
          "valor": 45.0,
          "prazo_dias": 2
        }
      ]
    },
    "total": 216.07,
    "peso_total_kg": 1.65,
    "calculo": {
      "subtotal": 212.3,
      "desconto": -21.23,
      "frete": 25.0,
      "total": 216.07
    }
  }
}
```

### Respostas de Erro

**400 - CEP Inválido:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CEP",
    "message": "CEP inválido ou não encontrado"
  }
}
```

**404 - Cupom Inválido:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_COUPON",
    "message": "Cupom inválido ou expirado"
  }
}
```

**400 - Valor Mínimo Não Atingido:**

```json
{
  "success": false,
  "error": {
    "code": "MINIMUM_NOT_REACHED",
    "message": "Valor mínimo para este cupom: R$ 150,00. Atual: R$ 120,50",
    "required": 150.0,
    "current": 120.5
  }
}
```

---

## ✅ Validar Estoque

Valida se todos os itens do carrinho têm estoque disponível.

### Endpoint

```
GET /api/cart/validate
```

### Autenticação

✅ **Requerida** (Token JWT)

### Exemplo de Requisição

**JavaScript:**

```javascript
const response = await axios.get("/api/cart/validate", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Resposta - Tudo OK (200)

```json
{
  "success": true,
  "message": "Todos os itens estão disponíveis",
  "data": {
    "valid": true,
    "items_verificados": 3,
    "problemas": []
  }
}
```

### Resposta - Com Problemas (200)

```json
{
  "success": true,
  "message": "Alguns itens precisam de atenção",
  "data": {
    "valid": false,
    "items_verificados": 3,
    "problemas": [
      {
        "item_id": "cart-item-001",
        "produto_id": "550e8400-...",
        "produto_nome": "Filtro de Óleo Motor Diesel",
        "quantidade_carrinho": 10,
        "quantidade_disponivel": 5,
        "tipo": "estoque_insuficiente",
        "mensagem": "Apenas 5 unidades disponíveis"
      },
      {
        "item_id": "cart-item-002",
        "produto_id": "660e8400-...",
        "produto_nome": "Pastilha de Freio",
        "tipo": "produto_indisponivel",
        "mensagem": "Produto não está mais disponível"
      }
    ]
  }
}
```

---

## 🔄 Sincronizar Carrinho (Opcional)

Mescla carrinho local (não autenticado) com carrinho do servidor após login.

### Endpoint

```
POST /api/cart/sync
```

### Autenticação

✅ **Requerida** (Token JWT)

### Body (JSON)

```json
{
  "local_items": [
    {
      "produto_id": "550e8400-e29b-41d4-a716-446655440000",
      "quantidade": 2
    },
    {
      "produto_id": "660e8400-e29b-41d4-a716-446655440001",
      "quantidade": 1
    }
  ]
}
```

### Exemplo de Requisição

**JavaScript:**

```javascript
// Ao fazer login, sincronizar carrinho local
const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

const response = await axios.post(
  "/api/cart/sync",
  {
    local_items: localCart,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

// Limpar carrinho local
localStorage.removeItem("cart");
```

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "message": "Carrinho sincronizado com sucesso",
  "data": {
    "items_merged": 2,
    "items_atualizados": 1,
    "items_novos": 1,
    "carrinho_atual": {
      "total_items": 4,
      "subtotal": 350.8
    }
  }
}
```

---

## 📊 Estatísticas do Carrinho (Admin)

Retorna estatísticas gerais sobre carrinhos.

### Endpoint

```
GET /api/cart/stats
```

### Autenticação

✅ **Requerida** (Token JWT)  
🔒 **Role:** `admin`

### Resposta de Sucesso (200)

```json
{
  "success": true,
  "data": {
    "total_carrinhos_ativos": 245,
    "total_items_carrinhos": 1523,
    "valor_total_carrinhos": 125430.5,
    "ticket_medio": 511.96,
    "carrinhos_abandonados_24h": 32,
    "produtos_mais_no_carrinho": [
      {
        "produto_id": "...",
        "nome": "Filtro de Óleo",
        "quantidade_total": 145
      }
    ]
  }
}
```

---

## 🔗 Fluxo Completo de Compra

### 1. Adicionar Produtos ao Carrinho

```javascript
await axios.post("/api/cart/items", {
  produto_id: "prod-123",
  quantidade: 2,
});
```

### 2. Ver/Atualizar Carrinho

```javascript
const cart = await axios.get("/api/cart");
```

### 3. Validar Estoque

```javascript
const validation = await axios.get("/api/cart/validate");
if (!validation.data.data.valid) {
  // Avisar usuário sobre problemas
}
```

### 4. Calcular Total com Frete

```javascript
const total = await axios.post("/api/cart/calculate", {
  cep_destino: "01310-100",
  cupom: "DESCONTO10",
});
```

### 5. Finalizar Pedido

```javascript
const order = await axios.post("/api/orders", {
  endereco_entrega_id: "addr-123",
  metodo_pagamento: "credit_card",
});
// Carrinho é limpo automaticamente após pedido criado
```

---

## 🔗 Relacionados

- [API de Produtos](./products.md)
- [API de Pedidos](./orders.md)
- [Regras de Negócio - Carrinho](../guides/business-rules.md#carrinho)

---

**Última atualização:** Dezembro 2025
