import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../config/prisma";

// ========================================
// 🛡️ MIDDLEWARE DE AUTENTICAÇÃO
// ========================================

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.log("🛡️ [authMiddleware] Iniciando...");

    // 1️⃣ Pegar token do header Authorization
    const authHeader = req.headers.authorization;
    console.log(
      "🛡️ [authMiddleware] authHeader:",
      authHeader ? "existe" : "NÃO EXISTE",
    );

    if (!authHeader) {
      console.log(" ❌ [authMiddleware] Sem Token!");
      res.status(401).json({
        success: false,
        message: "Token não fornecido",
      });
      return;
    }

    // 2️⃣ Extrair token (formato: "Bearer TOKEN")
    const token = authHeader.replace("Bearer ", "");
    console.log(
      "🛡️ [authMiddleware] Token extraído:",
      token.substring(0, 20) + "...",
    );

    if (!token) {
      console.log("❌ [authMiddleware] Token vazio!");
      res.status(401).json({
        success: false,
        message: "Token inválido",
      });
      return;
    }

    // 3️⃣ Verificar token JWT
    const decoded = verifyToken(token);
    console.log("🛡️ [authMiddleware] Decoded:", decoded);

    if (!decoded || typeof decoded === "string") {
      console.log("❌ [authMiddleware] Token inválido!");
      res.status(401).json({
        success: false,
        message: "Token inválido ou expirado",
      });
      return;
    }

    // 4️⃣ Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    });

    console.log("🛡️ [authMiddleware] User encontrado:", user?.id);

    if (!user) {
      console.log("❌ [authMiddleware] User não encontrado!");
      res.status(401).json({
        success: false,
        message: "Usuário não encontrado",
      });
      return;
    }

    // 5️⃣ Adicionar usuário ao request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    console.log("✅ [authMiddleware] User atribuído ao req:", req.user.id);

    next();
  } catch (error) {
    console.error("❌ Erro no middleware de autenticação:", error);
    res.status(401).json({
      success: false,
      message: "Erro ao validar token",
    });
  }
};

export default authMiddleware;
