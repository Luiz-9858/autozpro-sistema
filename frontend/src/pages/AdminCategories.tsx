import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { categoryService } from "../services/api";
import type { Category } from "../services/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Editar
        await categoryService.update(editingCategory.id, formData);
        toast.success("Categoria atualizada com sucesso!");
      } else {
        // Criar
        await categoryService.create(formData);
        toast.success("Categoria criada com sucesso!");
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as Error & { response?: { data?: { message?: string } } })
              .response?.data?.message || "Erro ao salvar categoria"
          : "Erro ao salvar categoria";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (category: Category) => {
    if (category.productCount > 0) {
      toast.error(
        `Não é possível deletar "${category.name}" pois existem ${category.productCount} produtos associados.`,
        { duration: 5000 },
      );
      return;
    }

    if (!confirm(`Tem certeza que deseja deletar "${category.name}"?`)) {
      return;
    }

    try {
      await categoryService.delete(category.id);
      toast.success("Categoria deletada com sucesso!");
      fetchCategories();
    } catch (err) {
      console.error("Erro ao deletar categoria:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as Error & { response?: { data?: { message?: string } } })
              .response?.data?.message || "Erro ao deletar categoria"
          : "Erro ao deletar categoria";
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "" });
    setEditingCategory(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Categorias</h2>
          <p className="text-gray-600 mt-1">
            Gerencie as categorias de produtos
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Nova Categoria
          </button>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingCategory ? "Editar Categoria" : "Nova Categoria"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Categoria *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Motor, Freios, Suspensão..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL amigável) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: motor, freios, suspensao..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Gerado automaticamente, mas você pode editar
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Breve descrição da categoria..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
              >
                {editingCategory ? "Atualizar" : "Criar"} Categoria
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-primary"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {category.name}
              </h3>
              <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                {category.productCount}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              <strong>Slug:</strong> {category.slug}
            </p>

            {category.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {category.description}
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <i className="fas fa-edit mr-2"></i>
                Editar
              </button>
              <button
                onClick={() => handleDelete(category)}
                disabled={category.productCount > 0}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  category.productCount > 0
                    ? "Não é possível deletar categoria com produtos"
                    : "Deletar categoria"
                }
              >
                <i className="fas fa-trash mr-2"></i>
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
