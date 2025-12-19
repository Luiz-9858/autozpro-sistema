import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold">AutozPro - Sistema de E-commerce</h1>
        <div className="card mt-4">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>Frontend configurado com sucesso!</p>
        </div>
        <p className="text-gray-600 mt-4">
          Vite + React + TypeScript + Tailwind CSS
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default App;
