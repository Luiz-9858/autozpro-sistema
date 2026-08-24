import { Link } from "react-router-dom";

/**
 * 🎯 BANNER HERO - COM ANIMAÇÕES PROFISSIONAIS
 *
 * Animações Tailwind:
 * - animate-fade-in: fade in suave
 * - animate-slide-up: sobe da base
 * - duration-500/700/1000: tempo em ms
 * - hover:scale-105: cresce ao passar mouse
 * - transition-all: transição suave
 */

export default function HomeHero() {
  return (
    <div className="relative bg-gradient-to-r from-primary via-red-600 to-red-700 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20 lg:py-28">
        <div className="text-center">
          {/* Badge "Bem-vindo" - Animado */}
          <div className="inline-block mb-4 md:mb-6 animate-fade-in">
            <span className="inline-block bg-white/20 backdrop-blur text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer">
              🚗 Bem-vindo à B77 Auto Parts
            </span>
          </div>

          {/* Título Principal - Slide Up + Fade */}
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Peças Automotivas
            <br />
            <span className="inline-block animate-pulse">de Qualidade</span>
          </h1>

          {/* Subtítulo - Fade In */}
          <p
            className="text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            Encontre as melhores peças para seu veículo com os melhores preços
            do mercado. Garantia de qualidade e entrega rápida.
          </p>

          {/* CTA Buttons - Fade In com Delay */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {/* Botão Principal */}
            <Link
              to="/products"
              className="group relative bg-white text-primary px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl active:scale-95"
            >
              <span className="flex items-center gap-2">
                <i className="fas fa-shopping-cart group-hover:animate-bounce"></i>
                Explorar Catálogo
              </span>
            </Link>

            {/* Botão Secundário */}
            <a
              href="#featured"
              className="group border-2 border-white text-white px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <i className="fas fa-list group-hover:rotate-180 transition-transform duration-300"></i>
                Ver Produtos
              </span>
            </a>
          </div>

          {/* Stats/Trust Indicators - Staggered Animation */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-12 border-t border-white/20 animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            {/* Stat 1: Produtos */}
            <div className="text-center group cursor-pointer">
              <p className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                5000+
              </p>
              <p className="text-white/80 text-sm md:text-base group-hover:text-white transition-colors duration-300">
                Produtos em Estoque
              </p>
            </div>

            {/* Stat 2: Clientes */}
            <div className="text-center group cursor-pointer">
              <p className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                5⭐
              </p>
              <p className="text-white/80 text-sm md:text-base group-hover:text-white transition-colors duration-300">
                Avaliação Média
              </p>
            </div>

            {/* Stat 3: Entrega */}
            <div className="text-center group cursor-pointer col-span-2 md:col-span-1">
              <p className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                24h
              </p>
              <p className="text-white/80 text-sm md:text-base group-hover:text-white transition-colors duration-300">
                Entrega Rápida
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-12 md:h-20"
          fill="white"
        >
          <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  );
}
