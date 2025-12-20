const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Meu Painel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Pedidos</h3>
          <p className="text-3xl font-bold text-primary">5</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Favoritos</h3>
          <p className="text-3xl font-bold text-secondary">12</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Carrinho</h3>
          <p className="text-3xl font-bold text-accent-red">3</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
