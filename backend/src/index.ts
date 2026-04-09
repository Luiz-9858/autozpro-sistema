import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import vehicleRoutes from "./routes/vehicleRoutes";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import bulkRoutes from "./routes/bulkRoutes";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ========================================
// 🗄️ PRISMA CLIENT
// ========================================
const prisma = new PrismaClient();

// ========================================
// 🔧 MIDDLEWARES
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// 🛣️ ROTAS
// ========================================

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor funcionando!" });
});

// Rotas de autenticação
app.use("/auth", authRoutes);

// Rotas de produtos
app.use("/api/products", productRoutes);

// Rotas de categorias
app.use("/api/categories", categoryRoutes);

// Rotas de admin
app.use("/api/admin", adminRoutes);

// Rotas de upload
app.use("/api/upload", uploadRoutes);

// Rotas de bulk (atualização em massa)
app.use("/api/bulk", bulkRoutes);

// 🚗 Rotas de veículos
app.use("/api/vehicles", vehicleRoutes);

// ========================================
// 🚀 INICIAR SERVIDOR
// ========================================

async function startServer() {
  try {
    // 🗄️ Testar conexão com banco
    await prisma.$connect();
    console.log("✅ Conectado ao banco de dados");

    // 🚀 Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao conectar com banco de dados:", error);
    process.exit(1);
  }
}

// Desconectar do banco ao fechar o servidor
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("\n👋 Desconectado do banco. Servidor encerrado.");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("\n👋 Desconectado do banco. Servidor encerrado.");
  process.exit(0);
});

// Iniciar
startServer();
