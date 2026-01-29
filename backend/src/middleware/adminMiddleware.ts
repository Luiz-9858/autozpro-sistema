import { Request, Response, NextFunction } from "express";

// ========================================
// 👑 MIDDLEWARE DE ADMIN
// ========================================

const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // 1️⃣ Verificar se o usuário foi autenticado
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
      return;
    }

    // 2️⃣ Verificar se o usuário é admin
    if (req.user.role !== "admin") {
      res.status(403).json({
        success: false,
        message:
          "Acesso negado. Apenas administradores podem realizar esta ação.",
      });
      return;
    }

    // 3️⃣ Usuário é admin, pode continuar
    next();
  } catch (error) {
    console.error("❌ Erro no middleware de admin:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao verificar permissões",
    });
  }
};

export default adminMiddleware;
