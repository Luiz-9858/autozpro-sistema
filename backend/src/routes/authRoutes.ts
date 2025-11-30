import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Rotas públicas
router.post("/register", register);
router.post("/login", login);

// Rotas protegidas (precisa estar logado)
router.get("/me", authenticate, getMe);

export default router;
