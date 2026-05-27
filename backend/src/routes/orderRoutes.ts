import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByNumber,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/orderController";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

/**
 * 🛒 ROTAS DE PEDIDOS
 */

// ========================================
// 🔓 ROTAS PÚBLICAS
// ========================================

/**
 * POST /api/orders
 * Criar novo pedido (checkout)
 * Público - não precisa estar logado
 */
router.post("/", createOrder);

/**
 * GET /api/orders/number/:orderNumber
 * Buscar pedido por número (para rastreamento)
 * Público - cliente pode rastrear sem login
 */
router.get("/number/:orderNumber", getOrderByNumber);

// ========================================
// 🔐 ROTAS PROTEGIDAS (USUÁRIO LOGADO)
// ========================================

/**
 * GET /api/orders/my-orders
 * Listar pedidos do usuário logado
 */
router.get("/my-orders", authMiddleware, getMyOrders);

// ========================================
// 🔒 ROTAS ADMIN
// ========================================

/**
 * GET /api/orders
 * Listar todos os pedidos (com paginação e filtros)
 * Admin apenas
 */
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

/**
 * GET /api/orders/:id
 * Buscar pedido por ID
 * Admin apenas
 */
router.get("/:id", authMiddleware, adminMiddleware, getOrderById);

/**
 * PATCH /api/orders/:id/status
 * Atualizar status do pedido
 * Admin apenas
 */
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
