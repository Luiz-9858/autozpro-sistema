import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import bulkRoutes from "./routes/bulkRoutes"; // ✅ NOVO

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Rotas de bulk (atualização em massa) ✅ NOVO
app.use("/api/bulk", bulkRoutes);

// ========================================
// 🚀 INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
