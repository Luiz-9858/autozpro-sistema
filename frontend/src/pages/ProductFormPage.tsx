import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { productService, categoryService } from "../services/api";
import type { Category } from "../services/api";
import { FormSkeleton } from "../components/Skeleton";

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

  // 🔄 Buscar categorias ao carregar
  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

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
      }
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      toast.error("Erro ao carregar produto");
    } finally {
      setLoadingData(false);
    }
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

      if (isEditing) {
        await productService.update(id, productData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await productService.create(productData);
        toast.success("Produto criado com sucesso!");
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

  // 💀 SKELETON LOADING ao carregar produto para edição
  if (loadingData) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Form Skeleton */}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Filtro de Óleo Motor 1.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU (Código) *
            </label>
            <input
              type="text"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço (R$) *
            </label>
            <input
              type="number"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço Promocional (R$)
            </label>
            <input
              type="number"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estoque *
            </label>
            <input
              type="number"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
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

        {/* URL da Imagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL da Imagem
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://exemplo.com/imagem.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">
            Cole a URL de uma imagem online (opcional)
          </p>
        </div>

        {/* Status Ativo */}
        <div className="flex items-center gap-3">
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
