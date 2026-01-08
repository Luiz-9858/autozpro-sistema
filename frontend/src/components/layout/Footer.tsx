const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-primary">AUTOZ</span>
              <span className="text-secondary">PRO</span>
            </h3>
            <p className="text-gray-400 text-sm">
              A AutozPro foi estabelecida em 1983 para atender ao grande mercado
              automotivo. Somos a loja online número 1 de peças automotivas e
              para motocicletas.
            </p>
          </div>

          {/* Coluna 2: Atendimento ao Cliente */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">
              ATENDIMENTO AO CLIENTE
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/help" className="hover:text-white transition">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="/account" className="hover:text-white transition">
                  Minha Conta
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-white transition">
                  Rastrear Pedido
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-white transition">
                  Política de Devolução
                </a>
              </li>
              <li>
                <a href="/gift-cards" className="hover:text-white transition">
                  Cartões Presente
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Sobre Nós */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">SOBRE NÓS</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/company" className="hover:text-white transition">
                  Informações da Empresa
                </a>
              </li>
              <li>
                <a href="/press" className="hover:text-white transition">
                  Press Releases
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:text-white transition">
                  Carreiras
                </a>
              </li>
              <li>
                <a href="/reviews" className="hover:text-white transition">
                  Avaliações
                </a>
              </li>
              <li>
                <a href="/investors" className="hover:text-white transition">
                  Relações com Investidores
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Links Rápidos */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary">CATÁLOGOS</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="/catalog/all-makes"
                  className="hover:text-white transition"
                >
                  Todas as Marcas
                </a>
              </li>
              <li>
                <a
                  href="/catalog/all-parts"
                  className="hover:text-white transition"
                >
                  Todas as Peças
                </a>
              </li>
              <li>
                <a
                  href="/catalog/all-brands"
                  className="hover:text-white transition"
                >
                  Todas as Fabricantes
                </a>
              </li>
              <li>
                <a
                  href="/catalog/accessories"
                  className="hover:text-white transition"
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Info Boxes */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center">
                  🚚
                </div>
                <div>
                  <p className="font-semibold text-white">Entrega Mundial</p>
                  <p className="text-xs">
                    Entrega de mercadorias em todo o mundo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center">
                  💰
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Satisfeito ou Reembolsado
                  </p>
                  <p className="text-xs">Qualidade de produto garantida</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center">
                  🏷️
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Ótimos Preços e Qualidade
                  </p>
                  <p className="text-xs">
                    Mais de 10 milhões de peças diferentes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center">
                  💬
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Suporte de Primeira Linha
                  </p>
                  <p className="text-xs">Chat disponível de segunda a sábado</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center">
                  🔒
                </div>
                <div>
                  <p className="font-semibold text-white">Pagamentos Seguros</p>
                  <p className="text-xs">
                    Suas informações são processadas com segurança
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>© 2025 B77 Auto Parts. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
