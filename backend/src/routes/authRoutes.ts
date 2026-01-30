import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import authMiddleware from "../middleware/auth";

const router = Router();

// ========================================
// 🔓 ROTAS PÚBLICAS (sem autenticação)
// ========================================

// POST /auth/register - Criar novo usuário
router.post("/register", register);

// POST /auth/login - Login de usuário
router.post("/login", login);

// ========================================
// 🔐 ROTAS PROTEGIDAS (necessita autenticação)
// ========================================

// GET /auth/me - Obter dados do usuário autenticado
router.get("/me", authMiddleware, me);

export default router;
