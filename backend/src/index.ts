import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ========================================
// MIDDLEWARES GLOBAIS
// ========================================

// Segurança HTTP
app.use(helmet());

// CORS - permitir requisições do frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parser de JSON
app.use(express.json());

// Parser de URL encoded
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROTAS
// ========================================

// Rota de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API AutozPro funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Rotas de autenticação
app.use("/api/auth", authRoutes);

// Rota 404 - não encontrado
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
