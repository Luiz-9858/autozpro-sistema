import { v2 as cloudinary } from "cloudinary";

/**
 * 🖼️ CONFIGURAÇÃO DO CLOUDINARY
 *
 * Serviço de hospedagem de imagens na nuvem.
 * Usado para upload de fotos de produtos.
 */

// Configurar Cloudinary com credenciais do .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validar configuração
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("⚠️ Credenciais do Cloudinary não configuradas no .env");
}

export default cloudinary;
