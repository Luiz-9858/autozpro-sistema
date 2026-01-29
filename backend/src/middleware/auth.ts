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
    // 1️⃣ Pegar token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Token não fornecido",
      });
      return;
    }

    // 2️⃣ Extrair token (formato: "Bearer TOKEN")
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token inválido",
      });
      return;
    }

    // 3️⃣ Verificar token JWT
    const decoded = verifyToken(token);

    if (!decoded || typeof decoded === "string") {
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

    if (!user) {
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
