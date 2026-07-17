import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface ReviewCardProps {
  review: Review;
  onDelete?: (reviewId: string) => void;
  onEdit?: (review: Review) => void;
}

export default function ReviewCard({
  review,
  onDelete,
  onEdit,
}: ReviewCardProps) {
  const { user, token } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnReview = user?.id === review.user.id;
  const isAdmin = user?.role === "admin";
  const canDelete = isOwnReview || isAdmin;

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta avaliação?")) return;

    try {
      setIsDeleting(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/${review.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Avaliação deletada com sucesso");
        onDelete?.(review.id);
      } else {
        toast.error(data.message || "Erro ao deletar avaliação");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar avaliação");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fas fa-star ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{review.user.name}</h3>
            {review.verified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                <i className="fas fa-check mr-1"></i>
                Verificado
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {formatDate(review.createdAt)}
          </p>
        </div>

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
            title="Deletar avaliação"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3">{renderStars(review.rating)}</div>

      {/* Título */}
      <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>

      {/* Comentário */}
      <p className="text-gray-700 text-sm mb-3 line-clamp-3">
        {review.comment}
      </p>

      {/* Footer com ações */}
      {isOwnReview && (
        <div className="flex gap-2 pt-3 border-t">
          <button
            onClick={() => onEdit?.(review)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <i className="fas fa-edit"></i>
            Editar
          </button>
        </div>
      )}
    </div>
  );
}
