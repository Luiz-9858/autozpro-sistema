import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes"; // ✅ NOVO

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

// Rotas de categorias ✅ NOVO
app.use("/api/categories", categoryRoutes);

// ========================================
// 🚀 INICIAR SERVIDOR
// ========================================

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
