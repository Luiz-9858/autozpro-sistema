import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { uploadImage } from "../services/uploadService";

/**
 * 🖼️ COMPONENTE: ImageUpload
 *
 * Upload de imagens com preview e validação.
 * Integrado com Cloudinary via API.
 */

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  onImageUploaded,
  currentImageUrl,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImageUrl || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler para quando o usuário seleciona um arquivo
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são permitidas");
      return;
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Imagem muito grande. Máximo: 5MB");
      return;
    }

    // Criar preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    await handleUpload(file);
  };

  // Fazer upload para o Cloudinary
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      const response = await uploadImage(file);

      if (response.success && response.data) {
        toast.success("Imagem enviada com sucesso!");
        onImageUploaded(response.data.url);
      } else {
        toast.error(response.message || "Erro ao enviar imagem");
        setPreview(currentImageUrl || "");
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar imagem");
      setPreview(currentImageUrl || "");
    } finally {
      setUploading(false);
    }
  };

  // Abrir seletor de arquivo
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Remover imagem
  const handleRemoveImage = () => {
    setPreview("");
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
        aria-label="Upload de imagem do produto"
      />

      {/* Preview da imagem */}
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview da imagem do produto"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-300"
          />

          {/* Botão de remover */}
          {!uploading && !disabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-lg"
              title="Remover imagem"
              aria-label="Remover imagem"
            >
              <i className="fas fa-times"></i>
            </button>
          )}

          {/* Loading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="text-white text-center">
                <i className="fas fa-spinner fa-spin text-3xl mb-2"></i>
                <p className="text-sm">Enviando imagem...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Área de upload (quando não tem imagem)
        <div
          onClick={handleButtonClick}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition ${
            disabled || uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleButtonClick();
            }
          }}
          aria-label="Área de upload de imagem"
        >
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-600 font-medium mb-1">
            Clique para fazer upload
          </p>
          <p className="text-sm text-gray-500">PNG, JPG, WEBP até 5MB</p>
        </div>
      )}

      {/* Botão de trocar imagem (quando já tem preview) */}
      {preview && !uploading && !disabled && (
        <button
          type="button"
          onClick={handleButtonClick}
          className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          <i className="fas fa-sync-alt mr-2"></i>
          Trocar imagem
        </button>
      )}
    </div>
  );
}
