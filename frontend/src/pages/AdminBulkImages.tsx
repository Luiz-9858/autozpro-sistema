import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { bulkService } from "../services/api";

/**
 * 📸 PÁGINA: Upload em Massa de Imagens
 *
 * Permite admin fazer upload de CSV com SKU e URL das imagens.
 */

interface UpdateResult {
  sku: string;
  status: "success" | "error" | "not_found";
  message: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function AdminBulkImages() {
  const [csvText, setCsvText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<UpdateResult[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    success: number;
    notFound: number;
    errors: number;
  } | null>(null);

  // Baixar CSV modelo
  const downloadTemplate = () => {
    const template = `sku,imageUrl
FILTRO-001,https://exemplo.com/imagem1.jpg
OLEO-002,https://exemplo.com/imagem2.jpg
SUSPENSAO-003,https://exemplo.com/imagem3.jpg`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo-upload-imagens.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Baixar produtos sem imagem
  const downloadProductsWithoutImages = async () => {
    try {
      const response = await bulkService.getProductsWithoutImages();

      if (response.data.success) {
        const products = response.data.data;

        if (products.length === 0) {
          toast.success("Todos os produtos já têm imagem!");
          return;
        }

        // Criar CSV
        let csv = "sku,name,imageUrl\n";
        products.forEach((p: { sku: string; name: string }) => {
          csv += `${p.sku},"${p.name}",\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `produtos-sem-imagem-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success(`${products.length} produtos exportados!`);
      }
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Erro ao exportar produtos");
    }
  };

  // Processar CSV
  const handleUpload = async () => {
    if (!csvText.trim()) {
      toast.error("Cole o conteúdo do CSV");
      return;
    }

    try {
      setProcessing(true);
      setResults([]);
      setSummary(null);

      // Parse CSV
      const lines = csvText.trim().split("\n");
      const updates = [];

      // Pular header (primeira linha)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split por vírgula (CSV simples)
        const parts = line.split(",");
        if (parts.length < 2) {
          toast.error(`Linha ${i + 1} inválida: ${line}`);
          continue;
        }

        const sku = parts[0].trim();
        const imageUrl = parts[1].trim();

        if (sku && imageUrl) {
          updates.push({ sku, imageUrl });
        }
      }

      if (updates.length === 0) {
        toast.error("Nenhuma atualização válida encontrada no CSV");
        setProcessing(false);
        return;
      }

      // Enviar para backend
      const response = await bulkService.updateImages(updates);

      if (response.success) {
        setResults(response.results);
        setSummary(response.summary);

        toast.success(
          `${response.summary.success} imagens atualizadas com sucesso!`,
        );
      }
    } catch (error) {
      console.error("Erro ao processar CSV:", error);

      // Tratamento seguro de erro
      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError.response?.data?.message || "Erro ao processar atualização";

      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link
            to="/admin/products"
            className="text-gray-600 hover:text-gray-900"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          <i className="fas fa-images mr-3 text-primary"></i>
          Atualização em Massa de Imagens
        </h1>
        <p className="text-gray-600 mt-2">
          Faça upload de um CSV com SKU e URL das imagens para atualizar vários
          produtos de uma vez.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COLUNA ESQUERDA: Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            1. Prepare o CSV
          </h2>

          <div className="space-y-4 mb-6">
            <button
              onClick={downloadTemplate}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              <i className="fas fa-download mr-2"></i>
              Baixar CSV Modelo
            </button>

            <button
              onClick={downloadProductsWithoutImages}
              className="w-full bg-blue-100 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-200 transition font-semibold"
            >
              <i className="fas fa-file-export mr-2"></i>
              Exportar Produtos Sem Imagem
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">
            2. Cole o Conteúdo do CSV
          </h2>

          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="sku,imageUrl&#10;FILTRO-001,https://exemplo.com/foto1.jpg&#10;OLEO-002,https://exemplo.com/foto2.jpg"
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          />

          <button
            onClick={handleUpload}
            disabled={processing || !csvText.trim()}
            className="w-full mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Processando...
              </>
            ) : (
              <>
                <i className="fas fa-upload mr-2"></i>
                Atualizar Imagens
              </>
            )}
          </button>
        </div>

        {/* COLUNA DIREITA: Instruções e Resultados */}
        <div className="space-y-6">
          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              <i className="fas fa-info-circle mr-2"></i>
              Como usar
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>
                  Baixe o <strong>CSV Modelo</strong> ou exporte produtos sem
                  imagem
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>
                  Edite o CSV e adicione as URLs das imagens (uma por linha)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Cole o conteúdo completo do CSV no campo acima</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Clique em "Atualizar Imagens"</span>
              </li>
            </ol>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Formato do CSV:</strong>
              </p>
              <pre className="mt-2 bg-white p-2 rounded text-xs">
                {`sku,imageUrl
FILTRO-001,https://exemplo.com/foto.jpg
OLEO-002,https://exemplo.com/foto2.jpg`}
              </pre>
            </div>
          </div>

          {/* Resultados */}
          {summary && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                <i className="fas fa-chart-bar mr-2"></i>
                Resumo
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {summary.total}
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {summary.success}
                  </p>
                  <p className="text-xs text-green-700">Sucesso</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {summary.notFound}
                  </p>
                  <p className="text-xs text-yellow-700">Não Encontrados</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {summary.errors}
                  </p>
                  <p className="text-xs text-red-700">Erros</p>
                </div>
              </div>

              {/* Lista de resultados */}
              {results.length > 0 && (
                <div className="max-h-96 overflow-y-auto">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">
                    Detalhes:
                  </h4>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded text-sm ${
                          result.status === "success"
                            ? "bg-green-50 text-green-800"
                            : result.status === "not_found"
                              ? "bg-yellow-50 text-yellow-800"
                              : "bg-red-50 text-red-800"
                        }`}
                      >
                        <p className="font-semibold">{result.sku}</p>
                        <p className="text-xs">{result.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
