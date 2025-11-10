import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../components/UI/Button";
import { Category } from "../types";
import CategoryForm from "../components/Forms/CategoryForm";
import { categoriesAPI } from "../services/api";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirmDelete"))) return;

    try {
      await categoriesAPI.delete(id);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(t("common.error"));
    }
  };

  const handleSubmit = async (data: Omit<Category, "id"> | Category) => {
    setFormLoading(true);
    try {
      if (selectedCategory) {
        await categoriesAPI.update(selectedCategory.id, data);
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === selectedCategory.id
              ? { ...selectedCategory, ...data }
              : cat
          )
        );
      } else {
        const response = await categoriesAPI.create(data);
        setCategories((prev) => [...prev, response.data]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert(t("common.error"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => setIsFormOpen(false);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("categories.title")}
          </h1>
          <p className="text-gray-600">{t("categories.subtitle")}</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          {t("categories.newCategory")}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t("common.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3 flex-1">
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color || "#3B82F6" }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {category.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {category.slug}
                </p>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                title={t("common.edit")}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:text-red-800 transition-colors p-1"
                title={t("common.delete")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Search className="w-12 h-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm
              ? t("common.noSearchResults")
              : t("common.noItemsFound")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? t("common.tryDifferentSearch")
              : t("common.startCreating")}
          </p>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedCategory
                  ? t("categories.editCategory")
                  : t("categories.newCategory")}
              </h2>
              <CategoryForm
                category={selectedCategory || undefined}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
