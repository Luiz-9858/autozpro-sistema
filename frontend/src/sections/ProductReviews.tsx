import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
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

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, token } = useAuthStore();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const itemsPerPage = 10;

  // Buscar avaliações
  useEffect(() => {
    fetchReviews();
    if (user && token) {
      checkUserReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, selectedRating, user, token]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: "1",
        limit: itemsPerPage.toString(),
      });

      if (selectedRating) {
        queryParams.append("rating", selectedRating.toString());
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/product/${productId}?${queryParams}`,
      );

      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setAverageRating(data.data.averageRating);
        setTotalReviews(data.data.totalReviews);
      }
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
      toast.error("Erro ao carregar avaliações");
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews/check/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success && data.data.hasReview) {
        setUserReview(data.data.review);
      }
    } catch (error) {
      console.error("Erro ao verificar avaliação:", error);
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter((r) => r.id !== reviewId));
    if (userReview?.id === reviewId) {
      setUserReview(null);
      setIsEditing(false);
      setShowForm(false);
    }
    setTotalReviews(totalReviews - 1);
  };

  const handleEditReview = (review: Review) => {
    setUserReview(review);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setIsEditing(false);
    setUserReview(null);
    fetchReviews();
    checkUserReview();
  };

  const renderStarDistribution = () => {
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2 cursor-pointer">
            <button
              onClick={() =>
                setSelectedRating(selectedRating === rating ? null : rating)
              }
              className="flex items-center gap-1 flex-shrink-0"
            >
              {rating}
              <i className="fas fa-star text-yellow-400 text-sm"></i>
            </button>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-yellow-400 h-full"
                style={{
                  width:
                    totalReviews > 0
                      ? `${(reviews.filter((r) => r.rating === rating).length / totalReviews) * 100}%`
                      : "0%",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
        <p className="text-gray-600 mt-2">Carregando avaliações...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Resumo de Avaliações */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-1 mt-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                ></i>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
            </p>
          </div>

          {/* Botão Avaliar */}
          {user && token && !userReview && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              <i className="fas fa-star mr-2"></i>
              Avaliar este produto
            </button>
          )}
        </div>

        {/* Distribuição de Estrelas */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
          {renderStarDistribution()}
        </div>
      </div>

      {/* Formulário de Avaliação */}
      {showForm && user && token && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isEditing ? "Editar sua avaliação" : "Deixe sua avaliação"}
          </h3>
          <ReviewForm
            productId={productId}
            token={token}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setIsEditing(false);
            }}
            initialData={
              userReview
                ? {
                    rating: userReview.rating,
                    title: userReview.title,
                    comment: userReview.comment,
                  }
                : undefined
            }
            isEditing={isEditing}
            reviewId={userReview?.id}
          />
        </div>
      )}

      {/* Botão Login se não autenticado */}
      {!user || !token ? (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8 text-center">
          <p className="text-gray-700 mb-3">
            Faça login para deixar sua avaliação
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Fazer login
          </a>
        </div>
      ) : null}

      {/* Lista de Avaliações */}
      <div className="space-y-4 mb-8">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-comment text-3xl text-gray-300 mb-3 block"></i>
            <p className="text-gray-600">
              {selectedRating
                ? `Nenhuma avaliação com ${selectedRating} estrelas`
                : "Nenhuma avaliação ainda"}
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onDelete={handleDeleteReview}
              onEdit={handleEditReview}
            />
          ))
        )}
      </div>

      {/* Filtro Reset */}
      {selectedRating && (
        <div className="text-center mb-4">
          <button
            onClick={() => setSelectedRating(null)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Limpar filtro
          </button>
        </div>
      )}
    </div>
  );
}
