import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar se o usuário é admin
 * Deve ser usado DEPOIS do middleware authenticate
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    // O middleware authenticate já colocou o userRole no req
    const user = (req as any).user; // ✅ CORRETO!

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Autenticação necessária",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Acesso negado. Apenas administradores podem realizar esta ação.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao verificar permissões",
    });
  }
}
