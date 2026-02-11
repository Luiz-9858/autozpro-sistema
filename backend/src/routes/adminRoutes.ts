import { Router } from "express";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/adminMiddleware";
import {
  getDashboardStats,
  getLowStockProducts,
} from "../controllers/adminController";

const router = Router();

// ========================================
// 🔒 TODAS AS ROTAS REQUEREM AUTENTICAÇÃO + PERMISSÃO ADMIN
// ========================================

// Aplicar middlewares em todas as rotas
router.use(authMiddleware);
router.use(adminMiddleware);

// ========================================
// 📊 ROTAS DE ESTATÍSTICAS
// ========================================

// GET /api/admin/stats - Estatísticas do dashboard
router.get("/stats", getDashboardStats);

// GET /api/admin/low-stock - Produtos com estoque baixo
router.get("/low-stock", getLowStockProducts);

export default router;
