import { Toaster as HotToaster } from "react-hot-toast";

/**
 * 🔔 Componente de Notificações Toast
 *
 * Configuração global do react-hot-toast.
 * Coloque este componente no App.tsx ou layout principal.
 *
 * USO:
 * import toast from 'react-hot-toast';
 *
 * toast.success('Produto criado com sucesso!');
 * toast.error('Erro ao criar produto');
 * toast.loading('Salvando...');
 * toast('Mensagem neutra');
 */

export default function Toaster() {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Duração padrão
        duration: 4000,

        // Estilos globais
        style: {
          background: "#fff",
          color: "#363636",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          borderRadius: "8px",
          padding: "16px",
          fontSize: "14px",
          fontWeight: "500",
        },

        // Toast de sucesso ✅
        success: {
          duration: 3000,
          style: {
            background: "#10B981",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10B981",
          },
        },

        // Toast de erro ❌
        error: {
          duration: 5000,
          style: {
            background: "#EF4444",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#EF4444",
          },
        },

        // Toast de loading ⏳
        loading: {
          style: {
            background: "#3B82F6",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#3B82F6",
          },
        },
      }}
    />
  );
}
