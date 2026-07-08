import { Router } from "express";
import {
  createOrder,
  createStripeCheckout,
  handleStripeWebhook,
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

// POST routes
router.post("/", authMiddleware, createOrder);
router.post("/stripe-checkout", createStripeCheckout);
router.post("/stripe-webhook", handleStripeWebhook);

// GET routes (específicas PRIMEIRO)
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/number/:orderNumber", getOrderByNumber);

// GET routes (genéricas - admin)
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.get("/:id", authMiddleware, adminMiddleware, getOrderById);

// PATCH routes
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
