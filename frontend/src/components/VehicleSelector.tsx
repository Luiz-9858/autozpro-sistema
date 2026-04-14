import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVehicleStore } from "../store/vehicleStore";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * 🚗 SELETOR DE VEÍCULO CASCATA
 *
 * Conectado na API real de veículos.
 * Seleção cascata: Ano → Marca → Modelo → Versão
 * Responsivo: Accordion mobile, horizontal desktop
 */

export default function VehicleSelector() {
  const navigate = useNavigate();
  const {
    selectedVehicle,
    setYear,
    setBrand,
    setModel,
    setVersion,
    clearVehicle,
  } = useVehicleStore();

  // Accordion mobile
  const [isOpen, setIsOpen] = useState(false);

  // Dados da API
  const [years, setYears] = useState<number[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [versions, setVersions] = useState<
    Array<{ id: string; label: string; version: string }>
  >([]);

  // Loading states
  const [loading, setLoading] = useState({
    years: false,
    brands: false,
    models: false,
    versions: false,
  });

  // ========== FETCH ANOS ==========
  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      setLoading((prev) => ({ ...prev, years: true }));
      const response = await axios.get(`${API_URL}/api/vehicles/years`);
      if (response.data.success) {
        setYears(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar anos:", error);
    } finally {
      setLoading((prev) => ({ ...prev, years: false }));
    }
  };

  // ========== FETCH MARCAS (quando ano muda) ==========
  useEffect(() => {
    if (selectedVehicle.year) {
      fetchBrands(selectedVehicle.year);
    } else {
      setBrands([]);
      setModels([]);
      setVersions([]);
    }
  }, [selectedVehicle.year]);

  const fetchBrands = async (year: number) => {
    try {
      setLoading((prev) => ({ ...prev, brands: true }));
      const response = await axios.get(
        `${API_URL}/api/vehicles/brands?year=${year}`,
      );
      if (response.data.success) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar marcas:", error);
    } finally {
      setLoading((prev) => ({ ...prev, brands: false }));
    }
  };

  // ========== FETCH MODELOS (quando marca muda) ==========
  useEffect(() => {
    if (selectedVehicle.year && selectedVehicle.brand) {
      fetchModels(selectedVehicle.year, selectedVehicle.brand);
    } else {
      setModels([]);
      setVersions([]);
    }
  }, [selectedVehicle.year, selectedVehicle.brand]);

  const fetchModels = async (year: number, brand: string) => {
    try {
      setLoading((prev) => ({ ...prev, models: true }));
      const response = await axios.get(
        `${API_URL}/api/vehicles/models?year=${year}&brand=${brand}`,
      );
      if (response.data.success) {
        setModels(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar modelos:", error);
    } finally {
      setLoading((prev) => ({ ...prev, models: false }));
    }
  };

  // ========== FETCH VERSÕES (quando modelo muda) ==========
  useEffect(() => {
    if (
      selectedVehicle.year &&
      selectedVehicle.brand &&
      selectedVehicle.model
    ) {
      fetchVersions(
        selectedVehicle.year,
        selectedVehicle.brand,
        selectedVehicle.model,
      );
    } else {
      setVersions([]);
    }
  }, [selectedVehicle.year, selectedVehicle.brand, selectedVehicle.model]);

  const fetchVersions = async (year: number, brand: string, model: string) => {
    try {
      setLoading((prev) => ({ ...prev, versions: true }));
      const response = await axios.get(
        `${API_URL}/api/vehicles/versions?year=${year}&brand=${brand}&model=${model}`,
      );
      if (response.data.success) {
        setVersions(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao buscar versões:", error);
    } finally {
      setLoading((prev) => ({ ...prev, versions: false }));
    }
  };

  // ========== HANDLERS ==========
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setYear(value ? parseInt(value) : null);
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setBrand(value || null);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setModel(value || null);
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      const selectedVersion = versions.find((v) => v.id === value);
      setVersion(selectedVersion?.version || null, value);
    } else {
      setVersion(null, null);
    }
  };

  const handleSearch = () => {
    // Redirecionar para produtos com veículo selecionado
    // TODO: Filtrar produtos por veículo (próxima etapa)
    navigate("/products");
    setIsOpen(false); // Fechar accordion mobile
  };

  const handleClear = () => {
    clearVehicle();
    setIsOpen(false);
  };

  return (
    <section className="bg-gray-800 py-4 md:py-6 vehicle-selector">
      {" "}
      {/* ← ADICIONAR classe */}
      <div className="container mx-auto px-4">
        {/* MOBILE: Accordion/Vertical */}
        <div className="lg:hidden">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              // Prevenir scroll para o topo
              if (!isOpen) {
                setTimeout(() => {
                  document.querySelector(".vehicle-selector")?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                  });
                }, 100);
              }
            }}
            className="w-full flex items-center justify-between text-white py-3 px-4 bg-gray-700 rounded-lg mb-3"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-truck text-xl"></i>
              <span className="font-semibold">Selecione Seu Veículo</span>
            </div>
            <i
              className={`fas fa-chevron-down transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          {isOpen && (
            <div className="space-y-3 animate-fadeIn">
              {/* Ano */}
              <select
                value={selectedVehicle.year || ""}
                onChange={handleYearChange}
                disabled={loading.years}
                className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                aria-label="Selecione o ano"
              >
                <option value="">
                  {loading.years ? "Carregando anos..." : "1️⃣ Escolher Ano"}
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Marca */}
              <select
                value={selectedVehicle.brand || ""}
                onChange={handleBrandChange}
                disabled={!selectedVehicle.year || loading.brands}
                className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                aria-label="Selecionar marca"
              >
                <option value="">
                  {loading.brands
                    ? "Carregando marcas..."
                    : "2️⃣ Selecionar Marca"}
                </option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              {/* Modelo */}
              <select
                value={selectedVehicle.model || ""}
                onChange={handleModelChange}
                disabled={!selectedVehicle.brand || loading.models}
                className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                aria-label="Selecionar modelo"
              >
                <option value="">
                  {loading.models
                    ? "Carregando modelos..."
                    : "3️⃣ Selecionar Modelo"}
                </option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>

              {/* Versão */}
              <select
                value={selectedVehicle.vehicleId || ""}
                onChange={handleVersionChange}
                disabled={!selectedVehicle.model || loading.versions}
                className="w-full px-4 py-3 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                aria-label="Selecionar versão"
              >
                <option value="">
                  {loading.versions
                    ? "Carregando versões..."
                    : "4️⃣ Selecionar Versão (Opcional)"}
                </option>
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.label}
                  </option>
                ))}
              </select>

              {/* Botões */}
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold transition"
                >
                  Limpar
                </button>
                <button
                  onClick={handleSearch}
                  disabled={!selectedVehicle.model}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  BUSCAR PEÇAS →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP: Horizontal */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="text-white text-lg xl:text-xl flex items-center gap-2 whitespace-nowrap">
            <i className="fas fa-truck"></i>
            <span>Selecione Seu Veículo</span>
          </div>
          <div className="flex-1 flex gap-3">
            {/* Ano */}
            <select
              value={selectedVehicle.year || ""}
              onChange={handleYearChange}
              disabled={loading.years}
              className="flex-1 px-4 py-2 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              aria-label="Selecione o ano"
            >
              <option value="">
                {loading.years ? "Carregando..." : "1️⃣ Ano"}
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Marca */}
            <select
              value={selectedVehicle.brand || ""}
              onChange={handleBrandChange}
              disabled={!selectedVehicle.year || loading.brands}
              className="flex-1 px-4 py-2 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              aria-label="Selecionar marca"
            >
              <option value="">
                {loading.brands ? "Carregando..." : "2️⃣ Marca"}
              </option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Modelo */}
            <select
              value={selectedVehicle.model || ""}
              onChange={handleModelChange}
              disabled={!selectedVehicle.brand || loading.models}
              className="flex-1 px-4 py-2 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              aria-label="Selecionar modelo"
            >
              <option value="">
                {loading.models ? "Carregando..." : "3️⃣ Modelo"}
              </option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>

            {/* Versão */}
            <select
              value={selectedVehicle.vehicleId || ""}
              onChange={handleVersionChange}
              disabled={!selectedVehicle.model || loading.versions}
              className="flex-1 px-4 py-2 rounded bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
              aria-label="Selecionar versão"
            >
              <option value="">
                {loading.versions ? "Carregando..." : "4️⃣ Versão"}
              </option>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.label}
                </option>
              ))}
            </select>

            {/* Botões */}
            <button
              onClick={handleClear}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold transition whitespace-nowrap"
              title="Limpar seleção"
            >
              <i className="fas fa-times"></i>
            </button>
            <button
              onClick={handleSearch}
              disabled={!selectedVehicle.model}
              className="bg-primary hover:bg-primary-dark text-white px-6 xl:px-8 py-2 rounded font-semibold transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              IR →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
