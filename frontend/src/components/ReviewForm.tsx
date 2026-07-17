import { useState } from "react";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  token: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    rating: number;
    title: string;
    comment: string;
  };
  isEditing?: boolean;
  reviewId?: string;
}

export default function ReviewForm({
  productId,
  token,
  onSuccess,
  onCancel,
  initialData,
  isEditing = false,
  reviewId,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [title, setTitle] = useState(initialData?.title || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !comment.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (title.length > 100) {
      toast.error("Título não pode ter mais de 100 caracteres");
      return;
    }

    try {
      setIsSubmitting(true);

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`
        : `${import.meta.env.VITE_API_URL}/api/reviews`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          title,
          comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          isEditing
            ? "Avaliação atualizada com sucesso"
            : "Avaliação enviada com sucesso",
        );
        onSuccess?.();
      } else {
        toast.error(data.message || "Erro ao enviar avaliação");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao enviar avaliação");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarButtons = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-3xl transition transform hover:scale-110"
          >
            <i
              className={`fas fa-star ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            ></i>
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sua avaliação
        </label>
        {renderStarButtons()}
        <p className="text-sm text-gray-500 mt-1">{rating} de 5 estrelas</p>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 100))}
          maxLength={100}
          placeholder="Resumo da sua avaliação"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">
          {title.length}/100 caracteres
        </p>
      </div>

      {/* Comentário */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Seu comentário *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência com este produto..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Enviando...
            </>
          ) : isEditing ? (
            "Atualizar Avaliação"
          ) : (
            "Enviar Avaliação"
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
