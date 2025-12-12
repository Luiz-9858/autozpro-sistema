import { requireAdmin } from "../middleware/adminMiddleware";
import { Router } from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate } from "../middleware/auth";

const router = Router();

// ========================================
// ROTAS PÚBLICAS (sem autenticação)
// ========================================

/**
 * GET /api/products
 * Listar todos os produtos
 * Query params: categoryId, search, minPrice, maxPrice, page, limit
 */
router.get("/", listProducts);

/**
 * GET /api/products/:id
 * Ver detalhes de um produto específico
 */
router.get("/:id", getProduct);

// ========================================
// ROTAS PROTEGIDAS (apenas ADMIN)
// ========================================

/**
 * POST /api/products
 * Criar novo produto
 * Requer: autenticação + role admin
 */
console.log("📦 Registrando rota POST /api/products");
router.post("/", authenticate, requireAdmin, createProduct);

/**
 * PUT /api/products/:id
 * Atualizar produto existente
 * Requer: autenticação + role admin
 */
router.put("/:id", authenticate, requireAdmin, updateProduct);

/**
 * DELETE /api/products/:id
 * Deletar (desativar) produto
 * Requer: autenticação + role admin
 */
router.delete("/:id", authenticate, requireAdmin, deleteProduct);

export default router;
