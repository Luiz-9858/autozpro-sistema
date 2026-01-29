import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

// ========================================
// 🔓 ROTAS PÚBLICAS (sem autenticação)
// ========================================

// GET /api/products - Listar todos os produtos (COM PAGINAÇÃO)
router.get("/", getProducts);

// GET /api/products/:id - Buscar produto por ID
router.get("/:id", getProductById);

// ========================================
// 🔐 ROTAS PROTEGIDAS (admin apenas)
// ========================================

// POST /api/products - Criar novo produto (admin)
router.post("/", authMiddleware, adminMiddleware, createProduct);

// PUT /api/products/:id - Atualizar produto (admin)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// DELETE /api/products/:id - Deletar produto (admin)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
