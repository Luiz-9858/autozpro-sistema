import dotenv from "dotenv";
import path from "path";

// Carrega .env da raiz do backend
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("✅ Variáveis de ambiente carregadas");
console.log(
  "🔗 DATABASE_URL:",
  process.env.DATABASE_URL ? "Configurada" : "❌ NÃO ENCONTRADA"
);
