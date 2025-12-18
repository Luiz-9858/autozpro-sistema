import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
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
      </div>
    </>
  );
}

export default App;
