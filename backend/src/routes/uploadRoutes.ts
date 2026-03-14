import { Router } from "express";
import multer from "multer";
import { uploadImage, deleteImage } from "../controllers/uploadController";
import authMiddleware from "../middleware/auth";
import adminMiddleware from "../middleware/adminMiddleware";

/**
 * 🖼️ ROTAS: Upload de Imagens
 *
 * Gerencia upload e deleção de imagens no Cloudinary.
 * Rotas protegidas - apenas admins podem fazer upload.
 */

const router = Router();

// Configurar Multer para processar arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite: 5MB
  },
  fileFilter: (_req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas"));
    }
  },
});

// ========================================
// 📤 ROTAS DE UPLOAD (PROTEGIDAS - ADMIN)
// ========================================

/**
 * POST /api/upload
 * Upload de imagem (apenas admin)
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"), // Campo do formulário: "image"
  uploadImage,
);

/**
 * DELETE /api/upload/:publicId
 * Deletar imagem (apenas admin)
 */
router.delete("/:publicId", authMiddleware, adminMiddleware, deleteImage);

export default router;
