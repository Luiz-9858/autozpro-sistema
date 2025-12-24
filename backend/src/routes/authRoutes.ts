import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

// Rotas públicas
console.log("🔨 Registrando rota POST /register");
router.post("/register", register);

console.log("🔨 Registrando rota POST /login");
router.post("/login", login);

// Rotas protegidas (precisa estar logado)
console.log("🔨 Registrando rota GET /me");
router.get("/me", authenticate, getMe);

console.log("✅ Todas as rotas de autenticação foram registradas!");

export default router;
