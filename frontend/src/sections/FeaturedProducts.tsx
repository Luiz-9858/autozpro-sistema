import ProductCarousel from "../components/ProductCarousel";

/**
 * 💎 SEÇÃO: PRODUTOS EM DESTAQUE
 *
 * Produtos com desconto (salePrice < price)
 * Ordenados por mais recentes
 * Usa ProductCarousel como base
 *
 * Props passadas ao Carousel:
 * - title: "Produtos em Destaque"
 * - endpoint: "/featured" (chama GET /api/products/featured)
 * - icon: "fa-gem" (ícone Font Awesome - joia/destaque)
 * - badgeText: "DESCONTO 💎" (badge opcional)
 * - badgeColor: "bg-red-600" (cor do badge)
 * - limit: 6 (quantidade de produtos)
 *
 * DIFERENÇA:
 * - BestRated: Por qualidade (rating)
 * - BestSellers: Por popularidade (vendas)
 * - FeaturedProducts: Por desconto (promoção)
 *
 * CASOS DE USO:
 * - Quando precisa criar urgência de compra
 * - Estoque de produtos antigos
 * - Promoções sazonais
 * - Limpar estoque
 */

export default function FeaturedProducts() {
  return (
    <ProductCarousel
      title="Produtos em Destaque"
      endpoint="/featured"
      icon="fa-gem"
      badgeText="DESCONTO 💎"
      badgeColor="bg-red-600"
      limit={6}
    />
  );
}
