import ProductCarousel from "../components/ProductCarousel";

/**
 * 🌟 SEÇÃO: MELHORES AVALIADOS
 *
 * Produtos ordenados por rating (estrelas)
 * Usa ProductCarousel como base
 *
 * Props passadas ao Carousel:
 * - title: "Melhores Avaliados"
 * - endpoint: "/best-rated" (chama GET /api/products/best-rated)
 * - icon: "fa-star" (ícone Font Awesome)
 * - badgeText: "TOP ⭐" (badge opcional)
 * - badgeColor: "bg-yellow-600" (cor do badge)
 * - Limit: 8 (quantidade de produtos)
 */

export default function BestRated() {
  return (
    <ProductCarousel
      title="Melhores Avaliados"
      endpoint="/best-rated"
      icon="fa-star"
      badgeText="TOP ⭐"
      badgeColor="bg-yellow-600"
      limit={8}
    />
  );
}
