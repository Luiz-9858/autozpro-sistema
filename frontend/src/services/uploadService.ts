import axios from "axios";

const API_URL = "http://localhost:3001/api";

/**
 * 🖼️ SERVIÇO: Upload de Imagens
 *
 * Gerencia upload e deleção de imagens no Cloudinary via API.
 */

export interface UploadResponse {
  success: boolean;
  data?: {
    url: string;
    publicId: string;
    width: number;
    height: number;
    format: string;
  };
  message?: string;
}

/**
 * Upload de imagem para o Cloudinary
 * @param file - Arquivo de imagem (File)
 * @returns Dados da imagem uploadada (URL, publicId, etc)
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    // Criar FormData
    const formData = new FormData();
    formData.append("image", file);

    // Fazer upload
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || "Erro ao fazer upload",
      };
    }
    return {
      success: false,
      message: "Erro ao fazer upload da imagem",
    };
  }
};

/**
 * Deletar imagem do Cloudinary
 * @param publicId - ID público da imagem no Cloudinary
 * @returns Sucesso ou erro
 */
export const deleteImage = async (
  publicId: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    // Encodar publicId para URL
    const encodedPublicId = encodeURIComponent(publicId);

    // Deletar imagem
    const response = await axios.delete(
      `${API_URL}/upload/${encodedPublicId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || "Erro ao deletar imagem",
      };
    }
    return {
      success: false,
      message: "Erro ao deletar imagem",
    };
  }
};
