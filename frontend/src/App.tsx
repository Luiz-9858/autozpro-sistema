import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <h1>AutozPro - Sistema de E-commerce</h1>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Frontend configurado com sucesso!</p>
      </div>
      <p className="read-the-docs">Vite + React + TypeScript + Tailwind CSS</p>
    </>
  );
}

export default App;
