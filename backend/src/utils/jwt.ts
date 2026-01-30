import jwt from "jsonwebtoken";

/**
 * Interface do payload do token JWT
 */
export interface JwtPayload {
  userId: string;
}

/**
 * Gera um token JWT
 * @param payload - Dados do usuário para incluir no token
 * @returns Token JWT assinado
 */
export function generateToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn: string | number = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET não está definido no .env");
  }

  return jwt.sign({ userId: payload.userId }, secret, {
    expiresIn: expiresIn,
    algorithm: "HS256",
  } as jwt.SignOptions);
}

/**
 * Verifica e decodifica um token JWT
 * @param token - Token JWT a ser verificado
 * @returns Payload decodificado ou null se inválido
 */
export function verifyToken(token: string): JwtPayload | null {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não está definido no .env");
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extrai o token do header Authorization
 * @param authHeader - Header Authorization (formato: "Bearer TOKEN")
 * @returns Token ou null se inválido
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");

  // Formato esperado: "Bearer TOKEN"
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}

/**
 * Gera um token de refresh (validade maior)
 * @param payload - Dados do usuário
 * @returns Refresh token
 */
export function generateRefreshToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não está definido no .env");
  }

  // Refresh token dura 30 dias
  return jwt.sign(payload, secret, { expiresIn: "30d" });
}
