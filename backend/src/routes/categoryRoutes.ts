import { Router } from "express";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/adminMiddleware";
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = Router();

// ========================================
// 🔓 ROTAS PÚBLICAS
// ========================================

// GET /api/categories - Listar todas as categorias
router.get("/", getCategories);

// GET /api/categories/:id - Buscar categoria por ID
router.get("/:id", getCategoryById);

// GET /api/categories/slug/:slug - Buscar categoria por slug
router.get("/slug/:slug", getCategoryBySlug);

// ========================================
// 🔒 ROTAS PROTEGIDAS (ADMIN)
// ========================================

// POST /api/categories - Criar nova categoria
router.post("/", authMiddleware, adminMiddleware, createCategory);

// PUT /api/categories/:id - Atualizar categoria
router.put("/:id", authMiddleware, adminMiddleware, updateCategory);

// DELETE /api/categories/:id - Deletar categoria
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;
