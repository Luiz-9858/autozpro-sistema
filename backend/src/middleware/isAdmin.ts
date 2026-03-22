import { Request, Response, NextFunction } from "express";

/**
 * 🔐 MIDDLEWARE: Verificar Admin
 *
 * Verifica se o usuário autenticado é admin.
 * Deve ser usado DEPOIS do authenticateToken.
 */

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar se tem user (autenticado)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    // Verificar se é admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acesso negado. Apenas administradores.",
      });
    }

    // É admin, pode continuar
    next();
  } catch (error) {
    console.error("❌ Erro ao verificar admin:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao verificar permissões",
    });
  }
};
