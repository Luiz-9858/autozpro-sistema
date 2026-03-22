import { Router } from "express";
import {
  bulkUpdateImages,
  getProductsWithoutImages,
} from "../controllers/bulkImageController";
import authMiddleware from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

const router = Router();

/**
 * 📸 ROTAS: Atualização em Massa de Imagens
 *
 * Apenas admin pode acessar.
 */

// POST /api/bulk/images - Atualizar imagens em massa
router.post("/images", authMiddleware, isAdmin, bulkUpdateImages);

// GET /api/bulk/products-without-images - Listar produtos sem imagem
router.get(
  "/products-without-images",
  authMiddleware,
  isAdmin,
  getProductsWithoutImages,
);

export default router;
