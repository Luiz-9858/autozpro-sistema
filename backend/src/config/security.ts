import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { Express } from "express";

/**
 * Configura todas as proteções de segurança HTTP
 */
export function setupSecurity(app: Express): void {
  // ============================================
  // 1. HELMET - Proteção de Headers HTTP
  // ============================================
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // ============================================
  // 2. CORS - Controle de Acesso entre Domínios
  // ============================================
  const allowedOrigins = [
    "http://localhost:3000", // Frontend local React
    "http://localhost:5173", // Frontend local Vite
    "http://localhost:4200", // Frontend local Angular
  ];

  // Em produção, adicionar o domínio real
  if (process.env.NODE_ENV === "production" && process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.use(
    cors({
      origin: function (origin: any, callback: any) {
        // Permite requisições sem origin (ex: Postman, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Origem não permitida pelo CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // ============================================
  // 3. RATE LIMITING - Limite de Requisições
  // ============================================

  // Rate limit geral (100 requisições por 15 minutos)
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo de 100 requisições
    message: {
      success: false,
      message: "Muitas requisições. Tente novamente em 15 minutos.",
    },
    standardHeaders: true, // Retorna info no header `RateLimit-*`
    legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  });

  // Rate limit para autenticação (5 tentativas por 15 minutos)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo de 5 tentativas de login
    message: {
      success: false,
      message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
    },
    skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
  });

  // Rate limit para criação de recursos (20 por hora)
  const createLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20,
    message: {
      success: false,
      message: "Limite de criação atingido. Tente novamente em 1 hora.",
    },
  });

  // Aplicar rate limiters
  app.use("/api/", generalLimiter); // Todas as rotas
  app.use("/api/auth/login", authLimiter); // Login
  app.use("/api/auth/register", authLimiter); // Registro

  // Para aplicar em rotas específicas de criação, use:
  // app.use('/api/products', createLimiter);
}

/**
 * Configurações adicionais de segurança
 */
export const securityConfig = {
  // Tempo de expiração do token JWT
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Número de rounds do bcrypt
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "10"),

  // Ambiente
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  // URLs permitidas
  allowedOrigins: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4200",
  ],
};
