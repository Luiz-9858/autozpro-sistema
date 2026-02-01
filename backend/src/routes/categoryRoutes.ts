import { Router } from "express";
import {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
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

export default router;
