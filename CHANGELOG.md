# Changelog - B77 Auto Parts

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Não Lançado]

### 🚧 Em Desenvolvimento

#### Backend

- Sistema de upload de imagens real (Supabase Storage)
- Sistema de notificações por email
- Recuperação de senha
- Filtros avançados de produtos
- Sistema de cupons de desconto

#### Frontend

- Checkout completo com múltiplos passos
- Painel administrativo
- Sistema de avaliações de produtos
- Área de favoritos
- Histórico detalhado de pedidos com rastreamento

#### Testes

- Testes unitários (Backend)
- Testes de integração (Backend)
- Testes de componentes (Frontend)
- Testes end-to-end

#### DevOps

- CI/CD Pipeline
- Deploy automático
- Monitoramento e logs

---

## [0.2.0] - 2024-12-25

### 📚 Documentação

#### Adicionado

- Documentação técnica completa do projeto
  - Visão geral e objetivos do projeto
  - Stack tecnológica detalhada
  - Guia de instalação e configuração
- Documentação completa da API Backend
  - API de Produtos (`/api/products`)
  - API de Autenticação (`/api/auth`)
  - API de Carrinho (`/api/cart`)
  - API de Pedidos (`/api/orders`)
  - API de Usuários (`/api/users`)
  - Exemplos em cURL e JavaScript
  - Respostas de sucesso e erro
  - Validações e regras de negócio
- Documentação do Frontend
  - Estrutura de componentes reutilizáveis
  - Estrutura de páginas e rotas
  - Guias de desenvolvimento
  - Padrões de código
- Guia de contribuição detalhado
  - Padrões de código
  - Git workflow
  - Commits convencionais
  - Pull requests
  - Code review
- Documentação do Banco de Dados
  - Schema completo com Prisma
  - Diagrama ER (Entidade-Relacionamento)
  - Relacionamentos entre tabelas
- Estrutura de arquivos `README.md`
- Arquivo `CHANGELOG.md` (este arquivo)

---

## [0.1.0] - 2024-12-01

### ✨ Backend Implementado

#### Adicionado

- Servidor Express com TypeScript configurado e funcionando
- Banco de dados PostgreSQL configurado via Supabase
- ORM Prisma configurado e funcionando
- Sistema de autenticação completo
  - Registro de usuários
  - Login com JWT
  - Middleware de autenticação
  - Proteção de rotas
- API REST completa de Produtos
  - Listagem com paginação e filtros
  - Busca por ID
  - Criação de produtos (Admin)
  - Atualização de produtos (Admin)
  - Exclusão lógica de produtos (Admin)
  - Upload de imagens (com URLs fictícias temporárias)
- API REST completa de Carrinho
  - Adicionar produtos ao carrinho
  - Listar itens do carrinho
  - Atualizar quantidade
  - Remover itens
  - Limpar carrinho
  - Cálculo automático de totais
- API REST completa de Pedidos
  - Criar pedido a partir do carrinho
  - Listar pedidos do usuário
  - Buscar pedido por ID
  - Cancelar pedido
  - Atualizar status (Admin)
  - Adicionar código de rastreio (Admin)
  - Estatísticas de pedidos (Admin)
- API REST completa de Usuários
  - Buscar perfil do usuário
  - Atualizar perfil
  - Alterar senha
  - Gerenciar endereços (CRUD completo)
  - Listar todos os usuários (Admin)
  - Ativar/desativar usuários (Admin)

#### Banco de Dados

- Schema Prisma completo com todas as tabelas
  - `users` - Usuários do sistema
  - `products` - Produtos da loja
  - `categories` - Categorias de produtos (hierárquicas)
  - `cart_items` - Itens do carrinho
  - `orders` - Pedidos
  - `order_items` - Itens dos pedidos
  - `addresses` - Endereços de entrega
- Migrations configuradas
- Relacionamentos entre entidades definidos
- Índices para otimização de consultas

#### Configuração

- Variáveis de ambiente (`.env`)
- ESLint e Prettier configurados
- Estrutura de pastas organizada
  - `/src/controllers` - Controladores
  - `/src/routes` - Rotas
  - `/src/middlewares` - Middlewares
  - `/src/services` - Lógica de negócio
  - `/src/utils` - Utilitários
  - `/prisma` - Schema e migrations

---

### ✨ Frontend Implementado

#### Adicionado

- Aplicação React 18 com TypeScript funcionando
- Vite configurado como build tool
- React Router v6 para roteamento
  - Rotas públicas
  - Rotas protegidas (autenticadas)
  - Rotas administrativas
- Tailwind CSS configurado e funcionando
- Componentes principais criados
  - Button (múltiplas variantes)
  - Input (com validação)
  - Modal
  - Card
  - Loading
  - Header
  - Footer
  - Sidebar
  - ProductCard
  - CartItem
- Páginas principais implementadas
  - Home - Página inicial
  - Products - Listagem de produtos
  - ProductDetails - Detalhes do produto
  - Login - Autenticação
  - Register - Cadastro
  - Cart - Carrinho de compras
  - Orders - Histórico de pedidos
  - Profile - Perfil do usuário
- Sistema de autenticação completo
  - Context API para gerenciar estado de autenticação
  - Login funcional
  - Registro funcional
  - Logout
  - Proteção de rotas
  - Persistência de token JWT
- Integração completa com API Backend
  - Axios configurado
  - Interceptors para token JWT
  - Tratamento de erros
  - Serviços para todas as APIs
- Carrinho de compras funcional
  - Adicionar produtos
  - Remover produtos
  - Atualizar quantidade
  - Cálculo de totais
  - Persistência local
  - Sincronização com backend

#### Configuração

- TypeScript configurado
- ESLint e Prettier configurados
- Variáveis de ambiente (`.env`)
- Path aliases configurados (`@/`)
- Estrutura de pastas organizada
  - `/src/components` - Componentes reutilizáveis
  - `/src/pages` - Páginas da aplicação
  - `/src/contexts` - Context API
  - `/src/hooks` - Custom hooks
  - `/src/services` - Integração com API
  - `/src/types` - Tipos TypeScript
  - `/src/routes` - Configuração de rotas

---

## [0.0.1] - 2024-11-12

### 🎉 Início do Projeto

#### Adicionado

- Criação inicial do repositório Git
- Estrutura de monorepo
  - Pasta `/backend`
  - Pasta `/frontend`
  - Pasta `/docs`
- Configuração inicial do ambiente de desenvolvimento
- Arquivo `.gitignore` configurado
- README.md inicial

---

## Planejamento de Versões Futuras

### [0.3.0] - Previsto

- ✅ Checkout completo
- ✅ Upload real de imagens
- ✅ Sistema de notificações

### [0.4.0] - Previsto

- ✅ Painel administrativo completo
- ✅ Relatórios e dashboard
- ✅ Sistema de cupons

### [0.5.0] - Previsto

- ✅ Testes automatizados
- ✅ CI/CD
- ✅ Deploy em produção

### [1.0.0] - Primeira Release

- ✅ Sistema completo e estável
- ✅ Documentação finalizada
- ✅ Testes completos
- ✅ Performance otimizada

---

## Legenda de Emojis

- 🎉 **Início**: Marcos importantes do projeto
- ✨ **Adicionado**: Novas funcionalidades
- 🐛 **Corrigido**: Correções de bugs
- 🔄 **Modificado**: Mudanças em funcionalidades existentes
- ❌ **Removido**: Funcionalidades removidas
- 🔒 **Segurança**: Correções de vulnerabilidades
- 📚 **Documentação**: Mudanças na documentação
- ⚡ **Performance**: Melhorias de performance
- 🚧 **Em Desenvolvimento**: Funcionalidades sendo desenvolvidas
- ♻️ **Refatoração**: Melhorias no código sem mudar funcionalidade
- 🎨 **Estilo**: Mudanças de formatação e estilo
- 🧪 **Testes**: Adição ou correção de testes

---

## Notas de Versionamento

Este projeto segue o [Semantic Versioning](https://semver.org/lang/pt-BR/):

- **MAJOR** (1.0.0): Mudanças incompatíveis com versões anteriores
- **MINOR** (0.1.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.1): Correções de bugs compatíveis

**Exemplo:**

- `0.1.0 → 0.2.0`: Nova funcionalidade adicionada
- `0.2.0 → 0.2.1`: Bug corrigido
- `0.2.1 → 1.0.0`: Mudança incompatível (breaking change)

---

**Última atualização:** 25 de Dezembro de 2025
