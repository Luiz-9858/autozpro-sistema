import ProductCarousel from "../components/ProductCarousel";

/**
 * 🔥 SEÇÃO: MAIS VENDIDOS
 *
 * Produtos ordenados por quantidade de vendas
 * Usa ProductCarousel como base
 *
 * Props passadas ao Carousel:
 * - title: "Mais Vendidos"
 * - endpoint: "/best-sellers" (chama GET /api/products/best-sellers)
 * - icon: "fa-fire" (ícone Font Awesome - fogo)
 * - badgeText: "BESTSELLER 🔥" (badge opcional)
 * - badgeColor: "bg-orange-600" (cor do badge)
 * - limit: 8 (quantidade de produtos)
 *
 * DIFERENÇA:
 * - BestRated mostra por rating (qualidade)
 * - BestSellers mostra por quantidade vendida (popularidade)
 * - Ambos usam o mesmo ProductCarousel!
 */

export default function BestSellers() {
  return (
    <ProductCarousel
      title="Mais Vendidos"
      endpoint="/best-sellers"
      icon="fa-fire"
      badgeText="BESTSELLER 🔥"
      badgeColor="bg-orange-600"
      limit={8}
    />
  );
}
