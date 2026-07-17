import { Router } from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  checkUserReview,
} from "../controllers/reviewController";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

/**
 * ⭐ ROTAS DE AVALIAÇÕES/REVIEWS
 */

// ========================================
// 🔓 ROTAS PÚBLICAS
// ========================================

/**
 * GET /api/reviews/product/:productId
 * Listar todas as avaliações de um produto
 * Público - qualquer um pode ver
 */
router.get("/product/:productId", getProductReviews);

// ========================================
// 🔐 ROTAS PROTEGIDAS (USUÁRIO LOGADO)
// ========================================

/**
 * POST /api/reviews
 * Criar nova avaliação
 * Usuário logado apenas
 */
router.post("/", authMiddleware, createReview);

/**
 * GET /api/reviews/check/:productId
 * Verificar se usuário já avaliou este produto
 * Usuário logado
 */
router.get("/check/:productId", authMiddleware, checkUserReview);

/**
 * PATCH /api/reviews/:reviewId
 * Atualizar própria avaliação
 * Dono da avaliação apenas
 */
router.patch("/:reviewId", authMiddleware, updateReview);

/**
 * DELETE /api/reviews/:reviewId
 * Deletar avaliação
 * Dono ou Admin
 */
router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;
