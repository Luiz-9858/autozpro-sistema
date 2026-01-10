const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xl mb-6 text-gray-250">COMPRE AS MELHORES</p>
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-accent-red">AUTOPEÇAS</span>
              <br />
              <span className="text-white">& ACESSÓRIOS</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Alta Qualidade - Desempenho Extremo
            </p>
            <button className="bg-secondary hover:bg-red-700 text-white-500 font-bold px-6 py-3 rounded-lg uppercase shadow-lg transition">
              SAIBA MAIS
            </button>
          </div>
        </div>
      </section>

      {/* Vehicle Selector */}
      <section className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="text-white text-xl">
              <i className="fas fa-truck"></i> Selecione Seu Veículo
            </div>
            <div className="flex-1 flex gap-4">
              <select
                className="flex-1 px-4 py-2 rounded bg-white text-gray-900"
                aria-label="selecione seu veiculo"
              >
                <option>1️⃣ Escolher Ano</option>
              </select>
              <select
                className="flex-1 px-4 py-2 rounded bg-white text-gray-900"
                aria-label="selecionar marca"
              >
                <option>2️⃣ Selecionar Marca</option>
              </select>
              <select
                className="flex-1 px-4 py-2 rounded bg-white text-gray-900"
                aria-label="selecionar modelo"
              >
                <option>3️⃣ Selecionar Modelo</option>
              </select>
              <select
                className="flex-1 px-4 py-2 rounded bg-white text-gray-900"
                aria-label="selecionar peça"
              >
                <option>4️⃣ Selecionar Peça</option>
              </select>
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-2 rounded font-semibold">
                IR →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Categorias Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Sistema de Freios", icon: "🛞" },
              { name: "Bancos", icon: "💺" },
              { name: "Sistema de Escape", icon: "⚙️" },
              { name: "Suspensão", icon: "🔧" },
              { name: "Elétrica", icon: "🔋" },
              { name: "Iluminação", icon: "💡" },
              { name: "Rodas & Pneus", icon: "🚙" },
              { name: "Filtros", icon: "🔍" },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center cursor-pointer"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Produtos em Destaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="border rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
                  <span className="text-4xl">🔧</span>
                </div>
                <h3 className="font-semibold mb-2">Produto Exemplo {item}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Descrição do produto
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    R$ 199,90
                  </span>
                  <button className="bg-secondary hover:bg-secondary-dark text-red-500 px-4 py-2 rounded text-sm font-bold">
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
