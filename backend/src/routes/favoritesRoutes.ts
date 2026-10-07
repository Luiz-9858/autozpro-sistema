import { Router } from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "../controllers/favoritesController";
import authMiddleware from "../middleware/auth";

/**
 * 🤍 FAVORITES ROUTES
 *
 * Rotas para gerenciar favoritos do usuário
 * Todas as rotas requerem autenticação
 *
 * ⚠️ IMPORTANTE: Rotas mais específicas devem vir PRIMEIRO
 * Senão "/" genérica captura tudo e impede execução das outras!
 */

const router = Router();

/**
 * GET /api/favorites/check/:productId
 * Verificar se um produto está nos favoritos
 *
 * Requer: Token JWT válido
 * Params: productId (ID do produto)
 * Retorna: { success: true, isFavorited: boolean }
 *
 * Exemplo:
 * GET /api/favorites/check/12345
 * Response: { "success": true, "isFavorited": true }
 *
 * ⚠️ DEVE SER ANTES DE GET / (rota mais específica)
 */
router.get("/check/:productId", authMiddleware, checkFavorite);

/**
 * GET /api/favorites
 * Listar todos os favoritos do usuário autenticado
 *
 * Requer: Token JWT válido
 * Retorna: Array com todos os favoritos do usuário
 *
 * Exemplo:
 * GET /api/favorites
 * Headers: Authorization: Bearer {token}
 * Response: { "success": true, "data": [...] }
 */
router.get("/", authMiddleware, getFavorites);

/**
 * POST /api/favorites
 * Adicionar um produto aos favoritos
 *
 * Requer: Token JWT válido
 * Body: { "productId": "123" }
 * Retorna: Objeto do favorito criado
 *
 * Exemplo:
 * POST /api/favorites
 * Body: { "productId": "abc123" }
 * Response: { "success": true, "data": { id, userId, productId, ... } }
 *
 * Erros possíveis:
 * - 401: Não autenticado
 * - 400: productId faltando
 * - 404: Produto não encontrado
 * - 409: Produto já está nos favoritos
 */
router.post("/", authMiddleware, addFavorite);

/**
 * DELETE /api/favorites/:productId
 * Remover um produto dos favoritos
 *
 * Requer: Token JWT válido
 * Params: productId (ID do produto a remover)
 * Retorna: Mensagem de sucesso
 *
 * Exemplo:
 * DELETE /api/favorites/abc123
 * Headers: Authorization: Bearer {token}
 * Response: { "success": true, "message": "Removido dos favoritos" }
 *
 * Erros possíveis:
 * - 401: Não autenticado
 * - 404: Favorito não encontrado
 */
router.delete("/:productId", authMiddleware, removeFavorite);

export default router;
