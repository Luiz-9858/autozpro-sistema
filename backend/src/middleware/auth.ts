import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader, JwtPayload } from "../utils/jwt";

/**
 * Estende a interface Request do Express para incluir dados do usuário
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware de autenticação
 * Verifica se o token JWT é válido e adiciona os dados do usuário ao request
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extrair token do header Authorization
    console.log("🔑 req.headers.authorization:", req.headers.authorization);
    const token = extractTokenFromHeader(req.headers.authorization);
    console.log("🔑 Token extraído:", token);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token não fornecido",
      });
      return;
    }

    // Verificar e decodificar o token
    const decoded = verifyToken(token);
    console.log("🔍 Tipo de decoded:", typeof decoded); // ADICIONE TEMPORÁRIO
    console.log("🔍 Decoded:", decoded); // ADICIONE TEMPORÁRIO

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Token inválido ou expirado",
      });
      return;
    }

    // Adicionar dados do usuário ao request
    req.user = decoded;
    console.log("req.user DEFINIDO:", req.user);
    console.log("🚀 VAI CHAMAR next()..."); // ADICIONE ESTA LINHA
    // Continuar para a próxima função
    next();
    console.log("🚀 next() FOI CHAMADO!"); // ADICIONE ESTA LINHA
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao verificar autenticação",
    });
  }
}

/**
 * Middleware para verificar se o usuário é administrador
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("🔐 requireAdmin - req.user:", req.user); // ADICIONE
  console.log("🔐 requireAdmin - !req.user:", !req.user); // ADICIONE

  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Autenticação necessária",
    });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      message: "Acesso negado. Apenas administradores.",
    });
    return;
  }

  next();
}

/**
 * Middleware opcional de autenticação
 * Não bloqueia a requisição se não houver token, apenas adiciona user se existir
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Ignora erros e continua sem autenticação
    next();
  }
}
