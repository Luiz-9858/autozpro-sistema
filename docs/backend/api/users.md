# API de Usuários e Perfil (Users)

## Índice

- [Visão Geral](#visão-geral)
- [Endpoints de Perfil](#endpoints-de-perfil)
  - [Buscar Perfil do Usuário](#buscar-perfil-do-usuário)
  - [Atualizar Perfil](#atualizar-perfil)
  - [Alterar Senha](#alterar-senha)
  - [Excluir Conta](#excluir-conta)
- [Endpoints de Endereços](#endpoints-de-endereços)
  - [Listar Endereços](#listar-endereços)
  - [Buscar Endereço por ID](#buscar-endereço-por-id)
  - [Criar Endereço](#criar-endereço)
  - [Atualizar Endereço](#atualizar-endereço)
  - [Excluir Endereço](#excluir-endereço)
  - [Definir Endereço Padrão](#definir-endereço-padrão)
- [Endpoints Administrativos](#endpoints-administrativos)
  - [Listar Todos os Usuários (Admin)](#listar-todos-os-usuários-admin)
  - [Buscar Usuário por ID (Admin)](#buscar-usuário-por-id-admin)
  - [Atualizar Usuário (Admin)](#atualizar-usuário-admin)
  - [Ativar/Desativar Usuário (Admin)](#ativardesativar-usuário-admin)
  - [Estatísticas de Usuários (Admin)](#estatísticas-de-usuários-admin)
- [Modelos de Dados](#modelos-de-dados)
- [Regras de Negócio](#regras-de-negócio)
- [Validações](#validações)

---

## Visão Geral

A API de Usuários gerencia perfis, dados pessoais e endereços dos usuários do e-commerce B77 Auto Parts. Implementa controles de privacidade e separação de permissões entre clientes e administradores.

**Base URL:** `/api/users`

**Autenticação:** Todos os endpoints requerem token JWT no header `Authorization: Bearer <token>`

**Permissões:**

- **Cliente:** Pode gerenciar apenas seus próprios dados e endereços
- **Admin:** Pode visualizar e gerenciar dados de todos os usuários

---

## Endpoints de Perfil

### Buscar Perfil do Usuário

Retorna os dados do perfil do usuário autenticado.

**Endpoint:** `GET /api/users/profile`

**Autenticação:** Requerida (Cliente ou Admin)

**Resposta de Sucesso:** `200 OK`

```json
{
  "message": "Endereço definido como padrão",
  "endereco": {
    "id": "uuid-endereco-1",
    "apelido": "Casa",
    "padrao": true,
    "updated_at": "2024-12-21T10:30:00Z"
  }
}
```

**Respostas de Erro:**

`404 Not Found` - Endereço não encontrado

```json
{
  "error": "Endereço não encontrado",
  "message": "O endereço solicitado não existe ou não pertence ao usuário"
}
```

**Exemplo cURL:**

```bash
curl -X PATCH http://localhost:3000/api/users/addresses/uuid-endereco-1/default \
  -H "Authorization: Bearer seu-token-jwt"
```

**Exemplo JavaScript:**

```javascript
const definirEnderecoPadrao = async (enderecoId) => {
  const response = await fetch(
    `http://localhost:3000/api/users/addresses/${enderecoId}/default`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Uso
await definirEnderecoPadrao("uuid-endereco-1");
console.log("Endereço padrão atualizado!");
```

**Regras de Negócio:**

- Apenas um endereço pode ser padrão por vez
- Ao definir um endereço como padrão, o anterior perde essa marcação automaticamente
- O endereço padrão é sugerido automaticamente no checkout

---

## Endpoints Administrativos

### Listar Todos os Usuários (Admin)

Retorna a lista de todos os usuários cadastrados. Apenas administradores podem usar este endpoint.

**Endpoint:** `GET /api/admin/users`

**Autenticação:** Requerida (Admin apenas)

**Query Parameters:**

- `page` (number, opcional, padrão: 1): Número da página
- `limit` (number, opcional, padrão: 10): Itens por página
- `search` (string, opcional): Buscar por nome, email ou CPF
- `role` (string, opcional): Filtrar por role (`cliente` ou `admin`)
- `ativo` (boolean, opcional): Filtrar por status ativo/inativo
- `sort` (string, opcional, padrão: `created_at:desc`): Ordenação
  - Valores: `created_at:asc`, `created_at:desc`, `nome:asc`, `nome:desc`

**Resposta de Sucesso:** `200 OK`

```json
{
  "usuarios": [
    {
      "id": "uuid-usuario-1",
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "cpf": "123.456.789-00",
      "telefone": "(11) 98765-4321",
      "role": "cliente",
      "ativo": true,
      "email_verificado": true,
      "pedidos_count": 15,
      "ultimo_pedido": "2024-12-20T10:30:00Z",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid-usuario-2",
      "nome": "Maria Santos",
      "email": "maria.santos@email.com",
      "cpf": "987.654.321-00",
      "telefone": "(11) 91234-5678",
      "role": "cliente",
      "ativo": true,
      "email_verificado": true,
      "pedidos_count": 8,
      "ultimo_pedido": "2024-12-18T14:20:00Z",
      "created_at": "2024-02-10T08:15:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 25,
    "total_items": 245,
    "items_per_page": 10
  },
  "resumo": {
    "total_usuarios": 245,
    "usuarios_ativos": 230,
    "usuarios_inativos": 15,
    "clientes": 243,
    "admins": 2
  }
}
```

**Exemplo cURL:**

```bash
curl -X GET "http://localhost:3000/api/admin/users?page=1&search=joão&ativo=true" \
  -H "Authorization: Bearer token-admin"
```

**Exemplo JavaScript:**

```javascript
const listarUsuarios = async (filtros = {}) => {
  const params = new URLSearchParams({
    page: filtros.page || 1,
    limit: filtros.limit || 10,
    ...(filtros.search && { search: filtros.search }),
    ...(filtros.role && { role: filtros.role }),
    ...(filtros.ativo !== undefined && { ativo: filtros.ativo }),
    ...(filtros.sort && { sort: filtros.sort }),
  });

  const response = await fetch(
    `http://localhost:3000/api/admin/users?${params}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  return await response.json();
};

// Uso - Buscar usuários inativos
const usuariosInativos = await listarUsuarios({ ativo: false });
console.log(`Usuários inativos: ${usuariosInativos.usuarios.length}`);
```

**Respostas de Erro:**

`403 Forbidden` - Sem permissão

```json
{
  "error": "Acesso negado",
  "message": "Apenas administradores podem acessar este recurso"
}
```

---

### Buscar Usuário por ID (Admin)

Retorna os detalhes completos de um usuário específico. Apenas administradores podem usar este endpoint.

**Endpoint:** `GET /api/admin/users/:id`

**Autenticação:** Requerida (Admin apenas)

**Parâmetros de URL:**

- `id` (string, obrigatório): UUID do usuário

**Resposta de Sucesso:** `200 OK`

```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-05-15",
  "role": "cliente",
  "ativo": true,
  "email_verificado": true,
  "enderecos": [
    {
      "id": "uuid-endereco-1",
      "apelido": "Casa",
      "cep": "01310-100",
      "logradouro": "Avenida Paulista",
      "numero": "1578",
      "cidade": "São Paulo",
      "estado": "SP",
      "padrao": true
    }
  ],
  "estatisticas": {
    "total_pedidos": 15,
    "pedidos_concluidos": 13,
    "pedidos_cancelados": 2,
    "valor_total_gasto": 12450.8,
    "ticket_medio": 830.05,
    "ultimo_pedido": "2024-12-20T10:30:00Z",
    "primeiro_pedido": "2024-02-01T14:20:00Z"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-12-20T14:45:00Z",
  "ultimo_acesso": "2024-12-21T09:15:00Z"
}
```

**Respostas de Erro:**

`404 Not Found` - Usuário não encontrado

```json
{
  "error": "Usuário não encontrado",
  "message": "O usuário solicitado não existe"
}
```

`403 Forbidden` - Sem permissão

```json
{
  "error": "Acesso negado",
  "message": "Apenas administradores podem acessar este recurso"
}
```

**Exemplo cURL:**

```bash
curl -X GET http://localhost:3000/api/admin/users/uuid-do-usuario \
  -H "Authorization: Bearer token-admin"
```

**Exemplo JavaScript:**

```javascript
const buscarUsuarioAdmin = async (usuarioId) => {
  const response = await fetch(
    `http://localhost:3000/api/admin/users/${usuarioId}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Usuário não encontrado");
  }

  return await response.json();
};

// Uso
const usuario = await buscarUsuarioAdmin("uuid-do-usuario");
console.log(`Cliente: ${usuario.nome}`);
console.log(
  `Total gasto: R$ ${usuario.estatisticas.valor_total_gasto.toFixed(2)}`
);
```

---

### Atualizar Usuário (Admin)

Atualiza os dados de um usuário. Apenas administradores podem usar este endpoint.

**Endpoint:** `PATCH /api/admin/users/:id`

**Autenticação:** Requerida (Admin apenas)

**Parâmetros de URL:**

- `id` (string, obrigatório): UUID do usuário

**Body:**

```json
{
  "nome": "João Silva Santos",
  "telefone": "(11) 98765-4321",
  "role": "admin",
  "ativo": true
}
```

**Campos Atualizáveis:**

- `nome` (string, opcional): Nome completo
- `telefone` (string, opcional): Telefone
- `data_nascimento` (string, opcional): Data de nascimento
- `role` (string, opcional): Role do usuário (`cliente` ou `admin`)
- `ativo` (boolean, opcional): Status ativo/inativo

**Validações:**

- As mesmas validações de atualização de perfil se aplicam
- Apenas admins podem alterar o campo `role`
- Não é possível desativar o próprio usuário admin

**Resposta de Sucesso:** `200 OK`

```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva Santos",
  "email": "joao.silva@email.com",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "role": "admin",
  "ativo": true,
  "updated_at": "2024-12-21T10:30:00Z"
}
```

**Respostas de Erro:**

`400 Bad Request` - Operação não permitida

```json
{
  "error": "Operação não permitida",
  "message": "Você não pode desativar sua própria conta de administrador"
}
```

`404 Not Found` - Usuário não encontrado

```json
{
  "error": "Usuário não encontrado",
  "message": "O usuário solicitado não existe"
}
```

`403 Forbidden` - Sem permissão

```json
{
  "error": "Acesso negado",
  "message": "Apenas administradores podem atualizar usuários"
}
```

**Exemplo cURL:**

```bash
curl -X PATCH http://localhost:3000/api/admin/users/uuid-do-usuario \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token-admin" \
  -d '{
    "role": "admin",
    "ativo": true
  }'
```

**Exemplo JavaScript:**

```javascript
const atualizarUsuarioAdmin = async (usuarioId, dados) => {
  const response = await fetch(
    `http://localhost:3000/api/admin/users/${usuarioId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(dados),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Promover usuário a admin
await atualizarUsuarioAdmin("uuid-do-usuario", { role: "admin" });
```

---

### Ativar/Desativar Usuário (Admin)

Ativa ou desativa um usuário no sistema. Apenas administradores podem usar este endpoint.

**Endpoint:** `PATCH /api/admin/users/:id/toggle-status`

**Autenticação:** Requerida (Admin apenas)

**Parâmetros de URL:**

- `id` (string, obrigatório): UUID do usuário

**Body:**

```json
{
  "ativo": false,
  "motivo": "Violação dos termos de uso"
}
```

**Campos:**

- `ativo` (boolean, obrigatório): Status desejado (true = ativo, false = inativo)
- `motivo` (string, opcional): Motivo da desativação

**Validações:**

- Não é possível desativar o próprio usuário admin
- Usuário desativado não pode fazer login
- Pedidos em andamento não são afetados

**Resposta de Sucesso:** `200 OK`

```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "ativo": false,
  "motivo_desativacao": "Violação dos termos de uso",
  "desativado_em": "2024-12-21T10:30:00Z",
  "desativado_por": "uuid-admin",
  "updated_at": "2024-12-21T10:30:00Z"
}
```

**Respostas de Erro:**

`400 Bad Request` - Operação não permitida

```json
{
  "error": "Operação não permitida",
  "message": "Você não pode desativar sua própria conta de administrador"
}
```

`404 Not Found` - Usuário não encontrado

```json
{
  "error": "Usuário não encontrado",
  "message": "O usuário solicitado não existe"
}
```

**Exemplo cURL:**

```bash
curl -X PATCH http://localhost:3000/api/admin/users/uuid-do-usuario/toggle-status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token-admin" \
  -d '{
    "ativo": false,
    "motivo": "Violação dos termos de uso"
  }'
```

**Exemplo JavaScript:**

```javascript
const toggleStatusUsuario = async (usuarioId, ativo, motivo = null) => {
  const response = await fetch(
    `http://localhost:3000/api/admin/users/${usuarioId}/toggle-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ ativo, motivo }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Desativar usuário
await toggleStatusUsuario(
  "uuid-do-usuario",
  false,
  "Violação dos termos de uso"
);

// Reativar usuário
await toggleStatusUsuario("uuid-do-usuario", true);
```

**Regras de Negócio:**

- Usuário desativado não pode fazer login
- Tokens existentes são invalidados
- E-mail de notificação é enviado ao usuário
- Histórico de desativação é mantido

---

### Estatísticas de Usuários (Admin)

Retorna estatísticas e métricas sobre os usuários. Apenas administradores podem usar este endpoint.

**Endpoint:** `GET /api/admin/users/stats`

**Autenticação:** Requerida (Admin apenas)

**Query Parameters:**

- `periodo` (string, opcional, padrão: `mes`): Período de análise
  - Valores: `hoje`, `semana`, `mes`, `ano`, `custom`
- `data_inicio` (string, opcional): Data inicial para período customizado (ISO 8601)
- `data_fim` (string, opcional): Data final para período customizado (ISO 8601)

**Resposta de Sucesso:** `200 OK`

```json
{
  "periodo": {
    "tipo": "mes",
    "inicio": "2024-12-01T00:00:00Z",
    "fim": "2024-12-31T23:59:59Z"
  },
  "resumo_geral": {
    "total_usuarios": 245,
    "usuarios_ativos": 230,
    "usuarios_inativos": 15,
    "novos_usuarios": 18,
    "clientes": 243,
    "admins": 2
  },
  "cadastros_por_dia": [
    {
      "data": "2024-12-01",
      "novos_usuarios": 3
    },
    {
      "data": "2024-12-02",
      "novos_usuarios": 5
    },
    {
      "data": "2024-12-03",
      "novos_usuarios": 2
    }
  ],
  "usuarios_mais_ativos": [
    {
      "id": "uuid-usuario-1",
      "nome": "João Silva",
      "email": "joao.silva@email.com",
      "total_pedidos": 45,
      "valor_total_gasto": 38920.5,
      "ultimo_pedido": "2024-12-20T10:30:00Z"
    },
    {
      "id": "uuid-usuario-2",
      "nome": "Maria Santos",
      "email": "maria.santos@email.com",
      "total_pedidos": 38,
      "valor_total_gasto": 32150.8,
      "ultimo_pedido": "2024-12-19T15:20:00Z"
    }
  ],
  "distribuicao_geografica": {
    "SP": 120,
    "RJ": 45,
    "MG": 38,
    "PR": 22,
    "RS": 20
  },
  "taxa_retencao": {
    "usuarios_com_pedidos": 198,
    "usuarios_recorrentes": 156,
    "taxa_recorrencia": 78.8
  },
  "engajamento": {
    "usuarios_ativos_7_dias": 145,
    "usuarios_ativos_30_dias": 198,
    "taxa_engajamento_7_dias": 59.2,
    "taxa_engajamento_30_dias": 80.8
  }
}
```

**Exemplo cURL:**

```bash
curl -X GET "http://localhost:3000/api/admin/users/stats?periodo=mes" \
  -H "Authorization: Bearer token-admin"
```

**Exemplo JavaScript:**

```javascript
const obterEstatisticasUsuarios = async (periodo = "mes") => {
  const response = await fetch(
    `http://localhost:3000/api/admin/users/stats?periodo=${periodo}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  return await response.json();
};

// Uso
const stats = await obterEstatisticasUsuarios("mes");
console.log(`Total de usuários: ${stats.resumo_geral.total_usuarios}`);
console.log(`Novos usuários no período: ${stats.resumo_geral.novos_usuarios}`);
console.log(`Taxa de recorrência: ${stats.taxa_retencao.taxa_recorrencia}%`);
```

**Respostas de Erro:**

`403 Forbidden` - Sem permissão

```json
{
  "error": "Acesso negado",
  "message": "Apenas administradores podem acessar estatísticas"
}
```

---

## Modelos de Dados

### User (Usuário)

```typescript
interface User {
  id: string; // UUID do usuário
  nome: string; // Nome completo
  email: string; // Email único
  senha_hash: string; // Hash da senha (bcrypt)
  cpf: string; // CPF único (formato: XXX.XXX.XXX-XX)
  telefone: string; // Telefone com DDD
  data_nascimento?: Date; // Data de nascimento
  role: UserRole; // Role do usuário
  ativo: boolean; // Status ativo/inativo
  email_verificado: boolean; // Email foi verificado
  motivo_desativacao?: string; // Motivo da desativação (se aplicável)
  desativado_em?: Date; // Data/hora da desativação
  desativado_por?: string; // UUID do admin que desativou
  ultimo_acesso?: Date; // Data/hora do último acesso
  created_at: Date; // Data/hora de criação
  updated_at: Date; // Data/hora da última atualização
}
```

### Address (Endereço)

```typescript
interface Address {
  id: string; // UUID do endereço
  user_id: string; // UUID do usuário
  apelido: string; // Nome/apelido do endereço
  cep: string; // CEP (formato: XXXXX-XXX)
  logradouro: string; // Nome da rua/avenida
  numero: string; // Número
  complemento?: string; // Complemento
  bairro: string; // Bairro
  cidade: string; // Cidade
  estado: string; // Sigla do estado (2 caracteres)
  pais: string; // País (padrão: Brasil)
  padrao: boolean; // É o endereço padrão?
  created_at: Date; // Data/hora de criação
  updated_at: Date; // Data/hora da última atualização
}
```

### UserRole (Enum)

```typescript
enum UserRole {
  CLIENTE = "cliente",
  ADMIN = "admin",
}
```

---

## Regras de Negócio

### Gestão de Perfil

1. **Alteração de Dados:**

   - Email não pode ser alterado diretamente (requer verificação)
   - CPF não pode ser alterado após o cadastro
   - Alteração de senha requer senha atual
   - Dados sensíveis são auditados

2. **Exclusão de Conta:**

   - Exclusão é lógica (soft delete)
   - Dados mantidos por 30 dias para reativação
   - Após 30 dias, dados são anonimizados (LGPD)
   - Histórico de pedidos mantido anonimizado
   - Não é possível excluir com pedidos pendentes

3. **Privacidade:**
   - Dados sensíveis (CPF, data de nascimento) são protegidos
   - Apenas o próprio usuário ou admin pode acessar dados completos
   - Logs de acesso são mantidos por auditoria

### Gestão de Endereços

1. **Limites:**

   - Máximo de 5 endereços por usuário
   - Apelidos devem ser únicos por usuário
   - Primeiro endereço é automaticamente padrão

2. **Endereço Padrão:**

   - Apenas um endereço pode ser padrão
   - Usado automaticamente no checkout
   - Ao definir novo padrão, anterior perde a marcação

3. **Exclusão:**
   - Não é possível excluir endereço em uso
   - Ao excluir endereço padrão, outro é promovido
   - Endereços são mantidos em pedidos históricos

### Administração

1. **Controle de Acesso:**

   - Apenas admins podem acessar endpoints administrativos
   - Admin não pode desativar própria conta
   - Alteração de role é auditada

2. **Desativação de Usuários:**

   - Usuário desativado não pode fazer login
   - Tokens existentes são invalidados
   - E-mail de notificação é enviado
   - Pedidos em andamento não são afetados

3. **Auditoria:**
   - Todas as ações administrativas são registradas
   - Histórico de alterações é mantido
   - Logs incluem usuário, ação, data/hora

---

## Validações

### Validações de Usuário

```javascript
// Nome
const validarNome = (nome) => {
  if (!nome || nome.trim().length < 3) {
    throw new Error("Nome deve ter pelo menos 3 caracteres");
  }
  if (nome.length > 100) {
    throw new Error("Nome deve ter no máximo 100 caracteres");
  }
  return nome.trim();
};

// Email
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new Error("Email inválido");
  }
  return email.toLowerCase().trim();
};

// CPF
const validarCPF = (cpf) => {
  const cpfLimpo = cpf.replace(/\D/g, "");

  if (cpfLimpo.length !== 11) {
    throw new Error("CPF deve ter 11 dígitos");
  }

  // Verificar dígitos verificadores
  // ... implementação completa da validação de CPF

  return cpfLimpo;
};

// Telefone
const validarTelefone = (telefone) => {
  const telefoneLimpo = telefone.replace(/\D/g, "");

  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    throw new Error("Telefone inválido");
  }

  // Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
  const ddd = telefoneLimpo.substring(0, 2);
  const numero = telefoneLimpo.substring(2);

  return `(${ddd}) ${numero.substring(0, numero.length - 4)}-${numero.substring(
    numero.length - 4
  )}`;
};

// Senha
const validarSenha = (senha) => {
  if (senha.length < 8) {
    throw new Error("Senha deve ter pelo menos 8 caracteres");
  }

  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

  if (!temMaiuscula || !temMinuscula || !temNumero || !temEspecial) {
    throw new Error(
      "Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
    );
  }

  return senha;
};

// Data de Nascimento
const validarDataNascimento = (data) => {
  const dataNascimento = new Date(data);
  const hoje = new Date();

  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes = hoje.getMonth() - dataNascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }

  if (idade < 18) {
    throw new Error("Usuário deve ter pelo menos 18 anos");
  }

  if (idade > 120) {
    throw new Error("Data de nascimento inválida");
  }

  return data;
};
```

### Validações de Endereço

```javascript
// CEP
const validarCEP = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    throw new Error("CEP deve ter 8 dígitos");
  }

  // Validar com API ViaCEP
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await response.json();

    if (dados.erro) {
      throw new Error("CEP não encontrado");
    }

    return {
      cep: `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`,
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
    };
  } catch (error) {
    throw new Error("Erro ao validar CEP");
  }
};

// Estado
const validarEstado = (estado) => {
  const estadosValidos = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  if (!estadosValidos.includes(estado.toUpperCase())) {
    throw new Error("Estado inválido");
  }

  return estado.toUpperCase();
};

// Apelido
const validarApelido = (apelido) => {
  if (!apelido || apelido.trim().length < 2) {
    throw new Error("Apelido deve ter pelo menos 2 caracteres");
  }
  if (apelido.length > 50) {
    throw new Error("Apelido deve ter no máximo 50 caracteres");
  }
  return apelido.trim();
};
```

---

## Exemplos Práticos

### Exemplo 1: Cadastro Completo de Usuário

```javascript
// Fluxo completo de cadastro
const cadastrarUsuarioCompleto = async (dados) => {
  try {
    // 1. Registrar usuário
    const { token, usuario } = await registrar({
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      cpf: dados.cpf,
      telefone: dados.telefone,
      data_nascimento: dados.data_nascimento,
    });

    console.log("Usuário registrado:", usuario.id);

    // 2. Fazer login automaticamente
    localStorage.setItem("token", token);

    // 3. Adicionar endereço
    const endereco = await criarEndereco({
      apelido: dados.endereco.apelido,
      cep: dados.endereco.cep,
      numero: dados.endereco.numero,
      complemento: dados.endereco.complemento,
    });

    console.log("Endereço cadastrado:", endereco.id);

    // 4. Buscar perfil atualizado
    const perfil = await buscarPerfil();

    return {
      sucesso: true,
      usuario: perfil,
      mensagem: "Cadastro realizado com sucesso!",
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: error.message,
    };
  }
};

// Uso
const resultado = await cadastrarUsuarioCompleto({
  nome: "João Silva",
  email: "joao.silva@email.com",
  senha: "Senha@123",
  cpf: "123.456.789-00",
  telefone: "(11) 98765-4321",
  data_nascimento: "1990-05-15",
  endereco: {
    apelido: "Casa",
    cep: "01310-100",
    numero: "1578",
    complemento: "Apto 101",
  },
});

if (resultado.sucesso) {
  console.log("Cadastro concluído!");
  // Redirecionar para dashboard
} else {
  console.error("Erro:", resultado.erro);
}
```

### Exemplo 2: Gerenciamento de Endereços

```javascript
// Componente de gerenciamento de endereços
class GerenciadorEnderecos {
  constructor(token) {
    this.token = token;
  }

  // Listar todos os endereços
  async listar() {
    const response = await fetch("http://localhost:3000/api/users/addresses", {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return await response.json();
  }

  // Criar novo endereço com busca de CEP
  async criar(dados) {
    // Buscar dados do CEP
    if (!dados.logradouro) {
      const dadosCep = await this.buscarCEP(dados.cep);
      dados = { ...dadosCep, ...dados };
    }

    const response = await fetch("http://localhost:3000/api/users/addresses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(dados),
    });

    return await response.json();
  }

  // Atualizar endereço
  async atualizar(id, dados) {
    const response = await fetch(
      `http://localhost:3000/api/users/addresses/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(dados),
      }
    );

    return await response.json();
  }

  // Excluir endereço
  async excluir(id) {
    const confirmacao = confirm("Deseja realmente excluir este endereço?");
    if (!confirmacao) return;

    const response = await fetch(
      `http://localhost:3000/api/users/addresses/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );

    return await response.json();
  }

  // Definir como padrão
  async definirPadrao(id) {
    const response = await fetch(
      `http://localhost:3000/api/users/addresses/${id}/default`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );

    return await response.json();
  }

  // Buscar CEP
  async buscarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, "");
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await response.json();

    if (dados.erro) {
      throw new Error("CEP não encontrado");
    }

    return {
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
    };
  }
}

// Uso
const gerenciador = new GerenciadorEnderecos(token);

// Listar endereços
const { enderecos } = await gerenciador.listar();
console.log(`Você tem ${enderecos.length} endereço(s) cadastrado(s)`);

// Adicionar novo endereço
const novoEndereco = await gerenciador.criar({
  apelido: "Trabalho",
  cep: "04543-907",
  numero: "3900",
  complemento: "Sala 405",
});
console.log("Endereço criado:", novoEndereco.id);

// Definir como padrão
await gerenciador.definirPadrao(novoEndereco.id);
console.log("Endereço definido como padrão!");
```

### Exemplo 3: Painel Administrativo

```javascript
// Dashboard administrativo
class PainelAdmin {
  constructor(adminToken) {
    this.token = adminToken;
  }

  // Buscar estatísticas
  async obterEstatisticas(periodo = "mes") {
    const response = await fetch(
      `http://localhost:3000/api/admin/users/stats?periodo=${periodo}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return await response.json();
  }

  // Listar usuários com filtros
  async listarUsuarios(filtros = {}) {
    const params = new URLSearchParams({
      page: filtros.page || 1,
      limit: filtros.limit || 20,
      ...(filtros.search && { search: filtros.search }),
      ...(filtros.ativo !== undefined && { ativo: filtros.ativo }),
    });

    const response = await fetch(
      `http://localhost:3000/api/admin/users?${params}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return await response.json();
  }

  // Buscar detalhes de um usuário
  async buscarUsuario(usuarioId) {
    const response = await fetch(
      `http://localhost:3000/api/admin/users/${usuarioId}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    return await response.json();
  }

  // Desativar usuário
  async desativarUsuario(usuarioId, motivo) {
    const confirmacao = confirm(`Desativar usuário?\nMotivo: ${motivo}`);
    if (!confirmacao) return;

    const response = await fetch(
      `http://localhost:3000/api/admin/users/${usuarioId}/toggle-status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ ativo: false, motivo }),
      }
    );

    return await response.json();
  }

  // Promover a admin
  async promoverAdmin(usuarioId) {
    const confirmacao = confirm("Promover este usuário a administrador?");
    if (!confirmacao) return;

    const response = await fetch(
      `http://localhost:3000/api/admin/users/${usuarioId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ role: "admin" }),
      }
    );

    return await response.json();
  }

  // Gerar relatório de usuários
  async gerarRelatorio() {
    const stats = await this.obterEstatisticas("mes");

    return {
      titulo: "Relatório de Usuários - " + new Date().toLocaleDateString(),
      total_usuarios: stats.resumo_geral.total_usuarios,
      usuarios_ativos: stats.resumo_geral.usuarios_ativos,
      usuarios_inativos: stats.resumo_geral.usuarios_inativos,
      novos_usuarios: stats.resumo_geral.novos_usuarios,
      taxa_engajamento: stats.engajamento.taxa_engajamento_30_dias,
      top_usuarios: stats.usuarios_mais_ativos,
      distribuicao: stats.distribuicao_geografica,
    };
  }
}

// Uso
const painel = new PainelAdmin(adminToken);

// Dashboard
const stats = await painel.obterEstatisticas("mes");
console.log("=== DASHBOARD DE USUÁRIOS ===");
console.log(`Total de usuários: ${stats.resumo_geral.total_usuarios}`);
console.log(`Usuários ativos: ${stats.resumo_geral.usuarios_ativos}`);
console.log(`Novos usuários (mês): ${stats.resumo_geral.novos_usuarios}`);
console.log(
  `Taxa de engajamento: ${stats.engajamento.taxa_engajamento_30_dias}%`
);

// Buscar usuários inativos
const { usuarios: inativos } = await painel.listarUsuarios({ ativo: false });
console.log(`\nUsuários inativos: ${inativos.length}`);

// Buscar usuário específico
const usuario = await painel.buscarUsuario("uuid-do-usuario");
console.log(`\nDetalhes do usuário:`);
console.log(`Nome: ${usuario.nome}`);
console.log(`Email: ${usuario.email}`);
console.log(`Total de pedidos: ${usuario.estatisticas.total_pedidos}`);
console.log(
  `Valor total gasto: R$ ${usuario.estatisticas.valor_total_gasto.toFixed(2)}`
);
```

### Exemplo 4: Formulário de Perfil com Validação

```javascript
// Formulário de atualização de perfil
class FormularioPerfil {
  constructor(token) {
    this.token = token;
    this.erros = {};
  }

  // Validar campos
  validar(dados) {
    this.erros = {};

    // Nome
    if (dados.nome && dados.nome.trim().length < 3) {
      this.erros.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    // Telefone
    if (dados.telefone) {
      const telefoneLimpo = dados.telefone.replace(/\D/g, "");
      if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
        this.erros.telefone = "Telefone inválido";
      }
    }

    // Data de nascimento
    if (dados.data_nascimento) {
      const dataNascimento = new Date(dados.data_nascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNascimento.getFullYear();

      if (idade < 18) {
        this.erros.data_nascimento = "Você deve ter pelo menos 18 anos";
      }
    }

    return Object.keys(this.erros).length === 0;
  }

  // Atualizar perfil
  async atualizar(dados) {
    // Validar
    if (!this.validar(dados)) {
      throw new Error("Dados inválidos: " + JSON.stringify(this.erros));
    }

    // Enviar
    const response = await fetch("http://localhost:3000/api/users/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  }

  // Alterar senha com validação
  async alterarSenha(senhaAtual, senhaNova) {
    // Validar força da senha
    if (senhaNova.length < 8) {
      throw new Error("Senha deve ter pelo menos 8 caracteres");
    }

    const temMaiuscula = /[A-Z]/.test(senhaNova);
    const temMinuscula = /[a-z]/.test(senhaNova);
    const temNumero = /[0-9]/.test(senhaNova);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senhaNova);

    if (!temMaiuscula || !temMinuscula || !temNumero || !temEspecial) {
      throw new Error(
        "Senha deve conter maiúsculas, minúsculas, números e caracteres especiais"
      );
    }

    // Enviar
    const response = await fetch("http://localhost:3000/api/users/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        senha_atual: senhaAtual,
        senha_nova: senhaNova,
        senha_nova_confirmacao: senhaNova,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  }

  // Excluir conta
  async excluirConta(senha, motivo) {
    const confirmacao = confirm(
      "Tem certeza que deseja excluir sua conta?\n" +
        "Esta ação não pode ser desfeita.\n\n" +
        "Seus dados serão mantidos por 30 dias para possível reativação."
    );

    if (!confirmacao) return;

    const response = await fetch("http://localhost:3000/api/users/profile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ senha, motivo }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  }
}

// Uso
const formulario = new FormularioPerfil(token);

// Atualizar perfil
try {
  const perfilAtualizado = await formulario.atualizar({
    nome: "João Silva Santos",
    telefone: "(11) 98765-4321",
  });
  console.log("Perfil atualizado com sucesso!");
} catch (error) {
  console.error("Erro:", error.message);
  // Mostrar erros no formulário
  console.log("Erros:", formulario.erros);
}

// Alterar senha
try {
  await formulario.alterarSenha("senhaAntiga123", "NovaSenha@456");
  console.log("Senha alterada com sucesso!");
} catch (error) {
  console.error("Erro:", error.message);
}
```

### Exemplo 5: Integração com CEP

```javascript
// Utilitário para trabalhar com endereços
class UtilEndereco {
  // Buscar CEP na API ViaCEP
  static async buscarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      throw new Error("CEP deve ter 8 dígitos");
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const dados = await response.json();

      if (dados.erro) {
        throw new Error("CEP não encontrado");
      }

      return {
        cep: `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`,
        logradouro: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
        complemento: dados.complemento,
      };
    } catch (error) {
      throw new Error("Erro ao buscar CEP: " + error.message);
    }
  }

  // Formatar CEP
  static formatarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return cep;
    return `${cepLimpo.substring(0, 5)}-${cepLimpo.substring(5)}`;
  }

  // Validar estado
  static validarEstado(estado) {
    const estadosValidos = [
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
    ];
    return estadosValidos.includes(estado.toUpperCase());
  }

  // Formatar endereço completo
  static formatarEnderecoCompleto(endereco) {
    const partes = [
      endereco.logradouro,
      endereco.numero,
      endereco.complemento,
      endereco.bairro,
      endereco.cidade,
      endereco.estado,
      endereco.cep,
    ].filter(Boolean);

    return partes.join(", ");
  }
}

// Uso em formulário
const handleCEPChange = async (cep) => {
  try {
    const dados = await UtilEndereco.buscarCEP(cep);

    // Preencher campos automaticamente
    setLogradouro(dados.logradouro);
    setBairro(dados.bairro);
    setCidade(dados.cidade);
    setEstado(dados.estado);

    // Focar no campo número
    document.getElementById("numero").focus();
  } catch (error) {
    console.error("Erro ao buscar CEP:", error.message);
    alert("CEP não encontrado. Por favor, preencha manualmente.");
  }
};
```

---

## Relacionamentos com Outras APIs

### Com API de Autenticação

- Cria sessões e tokens JWT
- Valida credenciais no login
- Gerencia tokens de redefinição de senha
- Valida e-mail para recuperação de conta

### Com API de Pedidos

- Associa pedidos aos usuários
- Valida endereços de entrega
- Fornece dados do usuário para pedidos
- Calcula estatísticas de compra

### Com API de Carrinho

- Associa carrinho ao usuário
- Mantém carrinho persistente entre sessões
- Limpa carrinho após criação de pedido

---

## Notas de Implementação

### Performance

- Use índices no banco de dados para `email`, `cpf`, `ativo`
- Implemente cache para perfis frequentemente acessados
- Use paginação em todas as listagens
- Otimize consultas de estatísticas com materialized views

### Segurança

- Hash de senha com bcrypt (cost factor 10-12)
- Sanitize todas as entradas do usuário
- Implemente rate limiting em endpoints sensíveis
- Use HTTPS em produção
- Implemente proteção contra SQL injection
- Valide CPF para evitar duplicatas
- Implemente timeout de sessão

### Privacidade e LGPD

- Dados sensíveis são criptografados em repouso
- Logs de acesso mantidos por auditoria
- Usuário pode solicitar exportação de dados
- Exclusão lógica com período de retenção (30 dias)
- Anonimização após período de retenção
- Política de privacidade aceita no cadastro

### Auditoria

- Registre todas as ações administrativas
- Mantenha histórico de alterações de dados
- Log de acessos e tentativas de login
- Alerte sobre atividades suspeitas
- Backup regular de dados

### Notificações

- E-mail de boas-vindas no cadastro
- Confirmação de alteração de dados
- Notificação de alteração de senha
- Alerta de desativação de conta
- E-mail de reativação disponível

---

## Tratamento de Erros

### Erros Comuns e Soluções

```javascript
// Handler genérico de erros
const handleUserError = (error) => {
  const errorMap = {
    "Email já cadastrado": {
      field: "email",
      message:
        "Este email já está em uso. Tente fazer login ou use outro email.",
      action: "redirect_to_login",
    },
    "CPF já cadastrado": {
      field: "cpf",
      message: "Este CPF já está cadastrado no sistema.",
      action: "contact_support",
    },
    "Senha incorreta": {
      field: "senha_atual",
      message: "A senha atual está incorreta.",
      action: "retry",
    },
    "Usuário não encontrado": {
      message: "Usuário não encontrado.",
      action: "redirect_to_home",
    },
    "Acesso negado": {
      message: "Você não tem permissão para acessar este recurso.",
      action: "redirect_to_home",
    },
    "CEP não encontrado": {
      field: "cep",
      message: "CEP não encontrado. Verifique e tente novamente.",
      action: "manual_fill",
    },
    "Limite de endereços excedido": {
      message:
        "Você atingiu o limite de 5 endereços. Exclua um endereço para adicionar outro.",
      action: "manage_addresses",
    },
  };

  const errorInfo = errorMap[error.message] || {
    message: "Ocorreu um erro. Tente novamente.",
    action: "retry",
  };

  return errorInfo;
};

// Uso
try {
  await atualizarPerfil(dados);
} catch (error) {
  const errorInfo = handleUserError(error);

  // Mostrar erro no campo específico
  if (errorInfo.field) {
    mostrarErroNoCampo(errorInfo.field, errorInfo.message);
  } else {
    mostrarAlerta(errorInfo.message);
  }

  // Executar ação
  switch (errorInfo.action) {
    case "redirect_to_login":
      window.location.href = "/login";
      break;
    case "contact_support":
      mostrarModalSuporte();
      break;
    case "manual_fill":
      habilitarPreenchimentoManual();
      break;
  }
}
```

---

## Conclusão

Esta documentação cobre todos os aspectos da API de Usuários e Perfil do B77 Auto Parts. Para questões relacionadas a autenticação e login, consulte [authentication.md](./authentication.md). Para informações sobre pedidos, consulte [orders.md](./orders.md).

**Recursos Relacionados:**

- [API de Autenticação](./authentication.md)
- [API de Pedidos](./orders.md)
- [API de Carrinho](./cart.md)
- [Esquema do Banco de Dados](../database/schema.md)

**Próximos Passos:**

- Implementar verificação de e-mail com token
- Adicionar autenticação de dois fatores (2FA)
- Implementar recuperação de conta via SMS
- Criar sistema de notificações in-app
- Adicionar preferências de privacidade detalhadas

```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva",
  "email": "joao.silva@email.com",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-05-15",
  "role": "cliente",
  "ativo": true,
  "email_verificado": true,
  "enderecos_count": 2,
  "pedidos_count": 15,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-12-20T14:45:00Z"
}
```

**Campos Sensíveis:**

- `cpf`: Retornado apenas para o próprio usuário ou admin
- `data_nascimento`: Retornado apenas para o próprio usuário ou admin

**Exemplo cURL:**

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer seu-token-jwt"
```

**Exemplo JavaScript:**

```javascript
const buscarPerfil = async () => {
  const response = await fetch("http://localhost:3000/api/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar perfil");
  }

  return await response.json();
};

// Uso
try {
  const perfil = await buscarPerfil();
  console.log(`Bem-vindo, ${perfil.nome}!`);
} catch (error) {
  console.error("Erro:", error.message);
}
```

---

### Atualizar Perfil

Atualiza os dados do perfil do usuário autenticado.

**Endpoint:** `PATCH /api/users/profile`

**Autenticação:** Requerida (Cliente ou Admin)

**Body:**

```json
{
  "nome": "João Silva Santos",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-05-15"
}
```

**Campos Atualizáveis:**

- `nome` (string, opcional): Nome completo do usuário
- `telefone` (string, opcional): Telefone com DDD
- `data_nascimento` (string, opcional): Data de nascimento (formato: YYYY-MM-DD)

**Campos NÃO Atualizáveis por este endpoint:**

- `email`: Use o endpoint específico de alteração de e-mail
- `cpf`: Não pode ser alterado após o cadastro
- `senha`: Use o endpoint de alteração de senha
- `role`: Apenas admins podem alterar via endpoint administrativo
- `ativo`: Apenas admins podem alterar via endpoint administrativo

**Validações:**

- `nome`: Mínimo 3 caracteres, máximo 100 caracteres
- `telefone`: Formato brasileiro válido: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
- `data_nascimento`: Data válida, usuário deve ter pelo menos 18 anos

**Resposta de Sucesso:** `200 OK`

```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva Santos",
  "email": "joao.silva@email.com",
  "cpf": "123.456.789-00",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1990-05-15",
  "role": "cliente",
  "ativo": true,
  "updated_at": "2024-12-21T10:30:00Z"
}
```

**Respostas de Erro:**

`400 Bad Request` - Validação falhou

```json
{
  "error": "Validação falhou",
  "message": "O nome deve ter pelo menos 3 caracteres",
  "field": "nome"
}
```

`400 Bad Request` - Idade insuficiente

```json
{
  "error": "Validação falhou",
  "message": "Usuário deve ter pelo menos 18 anos",
  "field": "data_nascimento"
}
```

**Exemplo cURL:**

```bash
curl -X PATCH http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-jwt" \
  -d '{
    "nome": "João Silva Santos",
    "telefone": "(11) 98765-4321"
  }'
```

**Exemplo JavaScript:**

```javascript
const atualizarPerfil = async (dados) => {
  const response = await fetch("http://localhost:3000/api/users/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Uso
try {
  const perfilAtualizado = await atualizarPerfil({
    nome: "João Silva Santos",
    telefone: "(11) 98765-4321",
  });
  console.log("Perfil atualizado com sucesso!");
} catch (error) {
  console.error("Erro ao atualizar:", error.message);
}
```

---

### Alterar Senha

Altera a senha do usuário autenticado.

**Endpoint:** `PATCH /api/users/password`

**Autenticação:** Requerida (Cliente ou Admin)

**Body:**

```json
{
  "senha_atual": "senhaAntiga123",
  "senha_nova": "novaSenha@456",
  "senha_nova_confirmacao": "novaSenha@456"
}
```

**Campos:**

- `senha_atual` (string, obrigatório): Senha atual do usuário
- `senha_nova` (string, obrigatório): Nova senha desejada
- `senha_nova_confirmacao` (string, obrigatório): Confirmação da nova senha

**Validações:**

- Senha atual deve estar correta
- Nova senha deve ter pelo menos 8 caracteres
- Nova senha deve conter: letras maiúsculas, minúsculas, números e caracteres especiais
- Nova senha não pode ser igual à senha atual
- Nova senha e confirmação devem ser idênticas

**Resposta de Sucesso:** `200 OK`

```json
{
  "message": "Senha alterada com sucesso",
  "updated_at": "2024-12-21T10:30:00Z"
}
```

**Respostas de Erro:**

`400 Bad Request` - Senha atual incorreta

```json
{
  "error": "Senha incorreta",
  "message": "A senha atual informada está incorreta"
}
```

`400 Bad Request` - Senha fraca

```json
{
  "error": "Senha inválida",
  "message": "A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais"
}
```

`400 Bad Request` - Senhas não conferem

```json
{
  "error": "Confirmação inválida",
  "message": "A nova senha e a confirmação não conferem"
}
```

**Exemplo cURL:**

```bash
curl -X PATCH http://localhost:3000/api/users/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-jwt" \
  -d '{
    "senha_atual": "senhaAntiga123",
    "senha_nova": "novaSenha@456",
    "senha_nova_confirmacao": "novaSenha@456"
  }'
```

**Exemplo JavaScript:**

```javascript
const alterarSenha = async (senhaAtual, senhaNova) => {
  const response = await fetch("http://localhost:3000/api/users/password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      senha_atual: senhaAtual,
      senha_nova: senhaNova,
      senha_nova_confirmacao: senhaNova,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Uso com validação de força da senha
const validarForcaSenha = (senha) => {
  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /[0-9]/.test(senha);
  const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
  const tamanhoMinimo = senha.length >= 8;

  return (
    temMaiuscula && temMinuscula && temNumero && temEspecial && tamanhoMinimo
  );
};

try {
  const senhaNova = "novaSenha@456";

  if (!validarForcaSenha(senhaNova)) {
    throw new Error("Senha não atende aos requisitos de segurança");
  }

  await alterarSenha("senhaAntiga123", senhaNova);
  console.log("Senha alterada com sucesso!");
} catch (error) {
  console.error("Erro:", error.message);
}
```

**Regras de Segurança:**

- A sessão atual permanece ativa após a alteração
- Um e-mail de notificação é enviado ao usuário
- Se houver múltiplas tentativas incorretas, o endpoint pode ser temporariamente bloqueado

---

### Excluir Conta

Solicita a exclusão da conta do usuário. A exclusão é lógica (soft delete).

**Endpoint:** `DELETE /api/users/profile`

**Autenticação:** Requerida (Cliente ou Admin)

**Body:**

```json
{
  "senha": "senhaAtual123",
  "motivo": "Não utilizo mais o serviço"
}
```

**Campos:**

- `senha` (string, obrigatório): Senha atual para confirmação
- `motivo` (string, opcional): Motivo da exclusão

**Validações:**

- Senha deve estar correta
- Não pode haver pedidos pendentes ou em andamento

**Resposta de Sucesso:** `200 OK`

```json
{
  "message": "Conta desativada com sucesso",
  "reativacao_possivel_ate": "2025-01-21T10:30:00Z"
}
```

**Respostas de Erro:**

`400 Bad Request` - Senha incorreta

```json
{
  "error": "Senha incorreta",
  "message": "A senha informada está incorreta"
}
```

`400 Bad Request` - Pedidos pendentes

```json
{
  "error": "Exclusão não permitida",
  "message": "Você possui pedidos em andamento. Aguarde a conclusão ou cancelamento dos pedidos antes de excluir sua conta.",
  "pedidos_pendentes": 2
}
```

**Exemplo cURL:**

```bash
curl -X DELETE http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-jwt" \
  -d '{
    "senha": "senhaAtual123",
    "motivo": "Não utilizo mais o serviço"
  }'
```

**Exemplo JavaScript:**

```javascript
const excluirConta = async (senha, motivo) => {
  const response = await fetch("http://localhost:3000/api/users/profile", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ senha, motivo }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};
```

**Regras de Negócio:**

- A conta é desativada (soft delete), não deletada permanentemente
- Dados são mantidos por 30 dias para possível reativação
- Após 30 dias, os dados são anonimizados conforme LGPD
- Histórico de pedidos é mantido anonimizado para fins contábeis

---

## Endpoints de Endereços

### Listar Endereços

Retorna todos os endereços cadastrados do usuário autenticado.

**Endpoint:** `GET /api/users/addresses`

**Autenticação:** Requerida (Cliente ou Admin)

**Resposta de Sucesso:** `200 OK`

```json
{
  "enderecos": [
    {
      "id": "uuid-endereco-1",
      "apelido": "Casa",
      "cep": "01310-100",
      "logradouro": "Avenida Paulista",
      "numero": "1578",
      "complemento": "Apto 101",
      "bairro": "Bela Vista",
      "cidade": "São Paulo",
      "estado": "SP",
      "pais": "Brasil",
      "padrao": true,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid-endereco-2",
      "apelido": "Trabalho",
      "cep": "04543-907",
      "logradouro": "Avenida Brigadeiro Faria Lima",
      "numero": "3900",
      "complemento": "Sala 405",
      "bairro": "Itaim Bibi",
      "cidade": "São Paulo",
      "estado": "SP",
      "pais": "Brasil",
      "padrao": false,
      "created_at": "2024-02-20T14:15:00Z",
      "updated_at": "2024-02-20T14:15:00Z"
    }
  ],
  "total": 2
}
```

**Exemplo cURL:**

```bash
curl -X GET http://localhost:3000/api/users/addresses \
  -H "Authorization: Bearer seu-token-jwt"
```

**Exemplo JavaScript:**

```javascript
const listarEnderecos = async () => {
  const response = await fetch("http://localhost:3000/api/users/addresses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

// Uso
const { enderecos } = await listarEnderecos();
const enderecoPadrao = enderecos.find((e) => e.padrao);
console.log(`Endereço padrão: ${enderecoPadrao.apelido}`);
```

---

### Buscar Endereço por ID

Retorna os detalhes de um endereço específico.

**Endpoint:** `GET /api/users/addresses/:id`

**Autenticação:** Requerida (Cliente ou Admin)

**Parâmetros de URL:**

- `id` (string, obrigatório): UUID do endereço

**Resposta de Sucesso:** `200 OK`

```json
{
  "id": "uuid-endereco-1",
  "user_id": "uuid-do-usuario",
  "apelido": "Casa",
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "numero": "1578",
  "complemento": "Apto 101",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil",
  "padrao": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Respostas de Erro:**

`404 Not Found` - Endereço não encontrado

```json
{
  "error": "Endereço não encontrado",
  "message": "O endereço solicitado não existe ou não pertence ao usuário"
}
```

**Exemplo cURL:**

```bash
curl -X GET http://localhost:3000/api/users/addresses/uuid-endereco-1 \
  -H "Authorization: Bearer seu-token-jwt"
```

---

### Criar Endereço

Cria um novo endereço para o usuário autenticado.

**Endpoint:** `POST /api/users/addresses`

**Autenticação:** Requerida (Cliente ou Admin)

**Body:**

```json
{
  "apelido": "Casa",
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "numero": "1578",
  "complemento": "Apto 101",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "padrao": false
}
```

**Campos:**

- `apelido` (string, obrigatório): Nome/apelido do endereço (ex: Casa, Trabalho)
- `cep` (string, obrigatório): CEP no formato XXXXX-XXX
- `logradouro` (string, obrigatório): Nome da rua/avenida
- `numero` (string, obrigatório): Número do endereço
- `complemento` (string, opcional): Complemento (apto, bloco, etc)
- `bairro` (string, obrigatório): Bairro
- `cidade` (string, obrigatório): Cidade
- `estado` (string, obrigatório): Sigla do estado (2 caracteres)
- `pais` (string, opcional, padrão: "Brasil"): País
- `padrao` (boolean, opcional, padrão: false): Define se é o endereço padrão

**Validações:**

- CEP deve ser válido e existir
- Estado deve ser uma sigla válida (AC, SP, RJ, etc)
- Apelido deve ter entre 2 e 50 caracteres
- Logradouro deve ter entre 3 e 100 caracteres
- Número não pode ser vazio
- Se `padrao: true`, remove o padrão dos outros endereços

**Resposta de Sucesso:** `201 Created`

```json
{
  "id": "uuid-novo-endereco",
  "user_id": "uuid-do-usuario",
  "apelido": "Casa",
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "numero": "1578",
  "complemento": "Apto 101",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil",
  "padrao": false,
  "created_at": "2024-12-21T10:30:00Z",
  "updated_at": "2024-12-21T10:30:00Z"
}
```

**Respostas de Erro:**

`400 Bad Request` - CEP inválido

```json
{
  "error": "CEP inválido",
  "message": "O CEP informado não é válido ou não foi encontrado"
}
```

`400 Bad Request` - Limite de endereços

```json
{
  "error": "Limite excedido",
  "message": "Você atingiu o limite máximo de 5 endereços cadastrados"
}
```

**Exemplo cURL:**

```bash
curl -X POST http://localhost:3000/api/users/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-jwt" \
  -d '{
    "apelido": "Casa",
    "cep": "01310-100",
    "logradouro": "Avenida Paulista",
    "numero": "1578",
    "complemento": "Apto 101",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP"
  }'
```

**Exemplo JavaScript com busca de CEP:**

```javascript
// Função auxiliar para buscar CEP
const buscarCEP = async (cep) => {
  const cepLimpo = cep.replace(/\D/g, "");
  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

  if (!response.ok) {
    throw new Error("CEP não encontrado");
  }

  const dados = await response.json();

  if (dados.erro) {
    throw new Error("CEP inválido");
  }

  return {
    logradouro: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    estado: dados.uf,
  };
};

// Criar endereço com busca automática
const criarEndereco = async (dados) => {
  // Buscar dados do CEP se não fornecidos
  if (!dados.logradouro || !dados.bairro) {
    const dadosCep = await buscarCEP(dados.cep);
    dados = { ...dadosCep, ...dados };
  }

  const response = await fetch("http://localhost:3000/api/users/addresses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};

// Uso
try {
  const endereco = await criarEndereco({
    apelido: "Casa",
    cep: "01310-100",
    numero: "1578",
    complemento: "Apto 101",
  });
  console.log("Endereço criado:", endereco.id);
} catch (error) {
  console.error("Erro:", error.message);
}
```

**Regras de Negócio:**

- Usuário pode cadastrar até 5 endereços
- Se for o primeiro endereço, é automaticamente definido como padrão
- Apelidos devem ser únicos por usuário

---

### Atualizar Endereço

Atualiza um endereço existente do usuário.

**Endpoint:** `PATCH /api/users/addresses/:id`

**Autenticação:** Requerida (Cliente ou Admin)

**Parâmetros de URL:**

- `id` (string, obrigatório): UUID do endereço

**Body:**

```json
{
  "apelido": "Casa Nova",
  "numero": "1580",
  "complemento": "Apto 102"
}
```

**Campos Atualizáveis:**

- Todos os campos do endereço podem ser atualizados
- As mesmas validações da criação se aplicam

**Resposta de Sucesso:** `200 OK`

```json
{
  "id": "uuid-endereco-1",
  "user_id": "uuid-do-usuario",
  "apelido": "Casa Nova",
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "numero": "1580",
  "complemento": "Apto 102",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "pais": "Brasil",
  "padrao": true,
  "updated_at": "2024-12-21T10:30:00Z"
}
```

**Respostas de Erro:**

`404 Not Found` - Endereço não encontrado

```json
{
  "error": "Endereço não encontrado",
  "message": "O endereço solicitado não existe ou não pertence ao usuário"
}
```

**Exemplo cURL:**

```bash
curl -X PATCH http://localhost:3000/api/users/addresses/uuid-endereco-1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-token-jwt" \
  -d '{
    "numero": "1580",
    "complemento": "Apto 102"
  }'
```

**Exemplo JavaScript:**

```javascript
const atualizarEndereco = async (enderecoId, dados) => {
  const response = await fetch(
    `http://localhost:3000/api/users/addresses/${enderecoId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};
```

---

### Excluir Endereço

Exclui um endereço do usuário.

**Endpoint:** `DELETE /api/users/addresses/:id`

**Autenticação:** Requerida (Cliente ou Admin)

**Parâmetros de URL:**

- `id` (string, obrigatório): UUID do endereço

**Validações:**

- Não é possível excluir um endereço que está sendo usado em pedidos pendentes
- Se excluir o endereço padrão, outro endereço será automaticamente definido como padrão

**Resposta de Sucesso:** `200 OK`

```json
{
  "message": "Endereço excluído com sucesso",
  "id": "uuid-endereco-1"
}
```

**Respostas de Erro:**

`400 Bad Request` - Endereço em uso

```json
{
  "error": "Operação não permitida",
  "message": "Este endereço não pode ser excluído pois está sendo usado em pedidos pendentes",
  "pedidos_pendentes": 2
}
```

`404 Not Found` - Endereço não encontrado

```json
{
  "error": "Endereço não encontrado",
  "message": "O endereço solicitado não existe ou não pertence ao usuário"
}
```

**Exemplo cURL:**

```bash
curl -X DELETE http://localhost:3000/api/users/addresses/uuid-endereco-1 \
  -H "Authorization: Bearer seu-token-jwt"
```

**Exemplo JavaScript:**

```javascript
const excluirEndereco = async (enderecoId) => {
  const confirmacao = confirm("Tem certeza que deseja excluir este endereço?");

  if (!confirmacao) {
    return;
  }

  const response = await fetch(
    `http://localhost:3000/api/users/addresses/${enderecoId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};
```

---

### Definir Endereço Padrão

Define um endereço como padrão para entregas.

**Endpoint:** `PATCH /api/users/addresses/:id/default`

**Autenticação:** Requerida (Cliente ou Admin)

**Parâmetros de URL:**

- `id` (string, obrigatório): UUID do endereço

**Resposta de Sucesso:** `200 OK`
