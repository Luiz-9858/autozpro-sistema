const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Coluna 1: Sobre */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              <span className="text-primary">B77 AUTO PARTS</span>
            </h3>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              A B77 Auto Parts foi estabelecida em 1983 para atender ao grande
              mercado automotivo. Somos a loja online número 1 de peças
              automotivas e para motocicletas.
            </p>
          </div>

          {/* Coluna 2: Atendimento ao Cliente */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold mb-3 md:mb-4 text-secondary text-sm md:text-base">
              ATENDIMENTO AO CLIENTE
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li>
                <a
                  href="/help"
                  className="hover:text-white transition inline-block"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="/account"
                  className="hover:text-white transition inline-block"
                >
                  Minha Conta
                </a>
              </li>
              <li>
                <a
                  href="/orders"
                  className="hover:text-white transition inline-block"
                >
                  Rastrear Pedido
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="hover:text-white transition inline-block"
                >
                  Política de Devolução
                </a>
              </li>
              <li>
                <a
                  href="/gift-cards"
                  className="hover:text-white transition inline-block"
                >
                  Cartões Presente
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Sobre Nós */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold mb-3 md:mb-4 text-secondary text-sm md:text-base">
              SOBRE NÓS
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li>
                <a
                  href="/company"
                  className="hover:text-white transition inline-block"
                >
                  Informações da Empresa
                </a>
              </li>
              <li>
                <a
                  href="/reviews"
                  className="hover:text-white transition inline-block"
                >
                  Avaliações
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Catálogos */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold mb-3 md:mb-4 text-secondary text-sm md:text-base">
              CATÁLOGOS
            </h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-400">
              <li>
                <a
                  href="/catalog/all-makes"
                  className="hover:text-white transition inline-block"
                >
                  Todas as Marcas
                </a>
              </li>
              <li>
                <a
                  href="/catalog/all-parts"
                  className="hover:text-white transition inline-block"
                >
                  Todas as Peças
                </a>
              </li>
              <li>
                <a
                  href="/catalog/all-brands"
                  className="hover:text-white transition inline-block"
                >
                  Todas as Fabricantes
                </a>
              </li>
              <li>
                <a
                  href="/catalog/accessories"
                  className="hover:text-white transition inline-block"
                >
                  Acessórios
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Info Boxes - Grid Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Box 2 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xl md:text-2xl">💰</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-white text-xs md:text-sm">
                  Satisfeito ou Reembolsado
                </p>
                <p className="text-xs text-gray-400">Qualidade garantida</p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xl md:text-2xl">🏷️</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-white text-xs md:text-sm">
                  Ótimos Preços
                </p>
                <p className="text-xs text-gray-400">+5 mil de peças</p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xl md:text-2xl">💬</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-white text-xs md:text-sm">
                  Suporte
                </p>
                <p className="text-xs text-gray-400">Chat seg-sáb</p>
              </div>
            </div>

            {/* Box 5 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xl md:text-2xl">🔒</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-white text-xs md:text-sm">
                  Pagamentos Seguros
                </p>
                <p className="text-xs text-gray-400">100% protegido</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-xs md:text-sm pt-4 border-t border-gray-800">
            <p>© 2025 B77 Auto Parts. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
