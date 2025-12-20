const Products = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Nossos Produtos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="bg-white border rounded-lg p-4 hover:shadow-lg transition"
          >
            <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
              <span className="text-4xl">🔧</span>
            </div>
            <h3 className="font-semibold mb-2">Produto {item}</h3>
            <p className="text-gray-600 text-sm mb-3">Descrição breve</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">R$ 299,90</span>
              <button className="bg-secondary hover:bg-secondary-dark text-gray-900 px-4 py-2 rounded text-sm font-semibold">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
