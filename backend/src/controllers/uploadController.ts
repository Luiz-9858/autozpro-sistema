import { Request, Response } from "express";
import cloudinary from "../config/cloudinaryConfig";

/**
 * 🖼️ CONTROLLER: Upload de Imagens
 *
 * Gerencia upload de imagens para o Cloudinary.
 */

// Extender Request do Express para incluir file do Multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * Upload de imagem para Cloudinary
 * POST /api/upload
 */
export const uploadImage = async (req: MulterRequest, res: Response) => {
  try {
    // Verificar se arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Nenhum arquivo foi enviado",
      });
    }

    // Converter buffer para base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload para Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "b77-autoparts/products", // Pasta no Cloudinary
      resource_type: "image",
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // Limita tamanho máximo
        { quality: "auto:good" }, // Otimiza qualidade
        { fetch_format: "auto" }, // Formato automático (webp quando possível)
      ],
    });

    // Retornar URL da imagem
    return res.status(200).json({
      success: true,
      data: {
        url: uploadResponse.secure_url, // URL HTTPS
        publicId: uploadResponse.public_id, // ID para deletar depois
        width: uploadResponse.width,
        height: uploadResponse.height,
        format: uploadResponse.format,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao fazer upload:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao fazer upload da imagem",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

/**
 * Deletar imagem do Cloudinary
 * DELETE /api/upload/:publicId
 */
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID não fornecido",
      });
    }

    // Decodificar publicId (vem encoded na URL)
    const decodedPublicId = decodeURIComponent(publicId);

    // Deletar do Cloudinary
    await cloudinary.uploader.destroy(decodedPublicId);

    return res.status(200).json({
      success: true,
      message: "Imagem deletada com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro ao deletar imagem:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao deletar imagem",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
