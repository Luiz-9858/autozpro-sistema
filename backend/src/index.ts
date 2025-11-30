import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { setupSecurity } from "./config/security";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// MIDDLEWARES GLOBAIS
// ============================================

// Parser de JSON
app.use(express.json());

// Parser de URL encoded
app.use(express.urlencoded({ extended: true }));

// Configurar segurança (Helmet, CORS, Rate Limit)
setupSecurity(app);

// ============================================
// ROTAS
// ============================================

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

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
