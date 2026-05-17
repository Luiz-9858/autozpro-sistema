import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { productService, categoryService } from "../services/api";
import type { Category } from "../services/api";
import { FormSkeleton } from "../components/Skeleton";
import ImageUpload from "../components/ImageUpload";

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  categoryId: string;
  isActive: boolean;
  imageUrl: string;
}

// 🚗 NOVO: Interface para veículo
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  version?: string | null;
  engine?: string | null;
  fuelType?: string | null;
}

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "",
    categoryId: "",
    isActive: true,
    imageUrl: "",
  });

  // 🚗 NOVO: Estados para veículos
  const [associatedVehicles, setAssociatedVehicles] = useState<Vehicle[]>([]);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehicleResults, setVehicleResults] = useState<Vehicle[]>([]);
  const [searchingVehicles, setSearchingVehicles] = useState(false);
  const [showVehicleResults, setShowVehicleResults] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  // 🚗 NOVO: Buscar veículos com debounce
  useEffect(() => {
    if (vehicleSearch.length < 3) {
      setVehicleResults([]);
      setShowVehicleResults(false);
      return;
    }

    const timer = setTimeout(() => {
      searchVehicles(vehicleSearch);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleSearch]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      toast.error("Erro ao carregar categorias");
    }
  };

  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoadingData(true);
      const response = await productService.getById(id);

      if (response.success && response.data) {
        const product = response.data;
        setFormData({
          name: product.name,
          sku: product.sku,
          description: product.description || "",
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() || "",
          stock: product.stock.toString(),
          categoryId: product.categoryId,
          isActive: product.isActive,
          imageUrl: product.imageUrl || "",
        });

        // 🚗 NOVO: Carregar veículos associados
        if (product.vehicles) {
          const vehicles = product.vehicles.map(
            (pv: { vehicle: Vehicle }) => pv.vehicle,
          );
          setAssociatedVehicles(vehicles);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      toast.error("Erro ao carregar produto");
    } finally {
      setLoadingData(false);
    }
  };

  // 🚗 NOVO: Buscar veículos na API
  const searchVehicles = async (query: string) => {
    try {
      setSearchingVehicles(true);

      // Chamar API de veículos (você precisa ter este endpoint)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/vehicles/admin-search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) throw new Error("Erro ao buscar veículos");

      const data = await response.json();

      if (data.success && data.data) {
        // Filtrar veículos já associados
        const filtered = data.data.filter(
          (v: Vehicle) => !associatedVehicles.find((av) => av.id === v.id),
        );
        setVehicleResults(filtered);
        setShowVehicleResults(true);
      }
    } catch (err) {
      console.error("Erro ao buscar veículos:", err);
      toast.error("Erro ao buscar veículos");
    } finally {
      setSearchingVehicles(false);
    }
  };

  // 🚗 NOVO: Adicionar veículo à lista
  const handleAddVehicle = (vehicle: Vehicle) => {
    setAssociatedVehicles((prev) => [...prev, vehicle]);
    setVehicleSearch("");
    setVehicleResults([]);
    setShowVehicleResults(false);
    toast.success(`${vehicle.brand} ${vehicle.model} adicionado!`);
  };

  // 🚗 NOVO: Remover veículo da lista
  const handleRemoveVehicle = (vehicleId: string) => {
    const vehicle = associatedVehicles.find((v) => v.id === vehicleId);
    setAssociatedVehicles((prev) => prev.filter((v) => v.id !== vehicleId));

    if (vehicle) {
      toast.success(`${vehicle.brand} ${vehicle.model} removido!`);
    }
  };

  // 🚗 NOVO: Formatar label do veículo
  const getVehicleLabel = (vehicle: Vehicle) => {
    let label = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
    if (vehicle.version) label += ` - ${vehicle.version}`;
    if (vehicle.engine) label += ` (${vehicle.engine})`;
    return label;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.name.trim()) {
      toast.error("Nome do produto é obrigatório");
      return;
    }

    if (!formData.sku.trim()) {
      toast.error("SKU é obrigatório");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error("Estoque deve ser maior ou igual a zero");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Selecione uma categoria");
      return;
    }

    // Preparar dados
    const productData = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      description: formData.description.trim() || null,
      price: parseFloat(formData.price),
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      stock: parseInt(formData.stock),
      categoryId: formData.categoryId,
      isActive: formData.isActive,
      imageUrl: formData.imageUrl.trim() || null,
    };

    try {
      setLoading(true);

      let productId = id;

      if (isEditing) {
        await productService.update(id!, productData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        const response = await productService.create(productData);
        if (response.success && response.data) {
          productId = response.data.id;
        }
        toast.success("Produto criado com sucesso!");
      }

      // 🚗 NOVO: Salvar associações de veículos
      if (productId && associatedVehicles.length > 0) {
        await saveVehicleAssociations(productId);
      }

      navigate("/admin/products");
    } catch (err: unknown) {
      console.error("Erro ao salvar produto:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as Error & { response?: { data?: { message?: string } } })
              .response?.data?.message || "Erro ao salvar produto"
          : "Erro ao salvar produto";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🚗 NOVO: Salvar associações de veículos
  const saveVehicleAssociations = async (productId: string) => {
    try {
      // Salvar cada veículo associado
      for (const vehicle of associatedVehicles) {
        await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/products/${productId}/vehicles`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ vehicleId: vehicle.id }),
          },
        );
      }
    } catch (err) {
      console.error("Erro ao salvar associações de veículos:", err);
      toast.error("Produto salvo, mas houve erro ao associar veículos");
    }
  };

  if (loadingData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/products")}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Voltar para lista de produtos"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Atualize as informações do produto"
              : "Adicione um novo produto ao catálogo"}
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 space-y-6"
      >
        {/* Nome e SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome do Produto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Filtro de Óleo Motor 1.0"
            />
          </div>

          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              SKU (Código) *
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: FILTRO-001"
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Descreva o produto, compatibilidade, especificações técnicas..."
          />
        </div>

        {/* Preços */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preço (R$) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
            />
          </div>

          <div>
            <label
              htmlFor="salePrice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preço Promocional (R$)
            </label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00 (opcional)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe vazio se não houver promoção
            </p>
          </div>
        </div>

        {/* Estoque e Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Estoque *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
            />
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoria *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              aria-label="Selecione a categoria do produto"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload de Imagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagem do Produto
          </label>
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            currentImageUrl={formData.imageUrl}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2">
            Faça upload de uma imagem ou deixe em branco para usar imagem padrão
          </p>
        </div>

        {/* 🚗 NOVO: Seção de Veículos Compatíveis */}
        <div className="border-t pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i className="fas fa-car text-primary"></i>
              Veículos Compatíveis
              {associatedVehicles.length > 0 && (
                <span className="text-sm font-normal text-gray-600">
                  ({associatedVehicles.length})
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Associe este produto aos veículos compatíveis
            </p>
          </div>

          {/* Busca de Veículos */}
          <div className="relative mb-4">
            <label
              htmlFor="vehicle-search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Buscar Veículo
            </label>
            <div className="relative">
              <input
                type="text"
                id="vehicle-search"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                placeholder="Digite marca, modelo ou ano... (min. 3 caracteres)"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {searchingVehicles ? (
                  <i className="fas fa-spinner fa-spin text-gray-400"></i>
                ) : (
                  <i className="fas fa-search text-gray-400"></i>
                )}
              </div>
            </div>

            {/* Resultados da busca */}
            {showVehicleResults && vehicleResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {vehicleResults.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => handleAddVehicle(vehicle)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getVehicleLabel(vehicle)}
                        </p>
                        {vehicle.fuelType && (
                          <p className="text-xs text-gray-500">
                            {vehicle.fuelType}
                          </p>
                        )}
                      </div>
                      <i className="fas fa-plus-circle text-primary"></i>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showVehicleResults &&
              vehicleResults.length === 0 &&
              !searchingVehicles && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
                  Nenhum veículo encontrado
                </div>
              )}
          </div>

          {/* Lista de Veículos Associados */}
          {associatedVehicles.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Veículos Associados:
              </p>
              {associatedVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getVehicleLabel(vehicle)}
                      </p>
                      {vehicle.fuelType && (
                        <p className="text-xs text-gray-500">
                          {vehicle.fuelType}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVehicle(vehicle.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Remover veículo"
                  >
                    <i className="fas fa-times-circle text-lg"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <i className="fas fa-car text-4xl text-gray-300 mb-2"></i>
              <p className="text-sm text-gray-600">
                Nenhum veículo associado ainda
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Use a busca acima para adicionar veículos compatíveis
              </p>
            </div>
          )}
        </div>

        {/* Status Ativo */}
        <div className="flex items-center gap-3 border-t pt-6">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-700"
          >
            Produto ativo (visível para clientes)
          </label>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                {isEditing ? "Atualizando..." : "Criando..."}
              </>
            ) : (
              <>
                <i
                  className={`fas ${isEditing ? "fa-save" : "fa-plus"} mr-2`}
                ></i>
                {isEditing ? "Atualizar Produto" : "Criar Produto"}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
