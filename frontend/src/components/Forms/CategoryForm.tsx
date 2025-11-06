import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { generateSlug } from '../../utils/helpers';
import Button from '../UI/Button';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (category: Omit<Category, 'id'> | Category) => void;
  onCancel: () => void;
  loading?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color || '#3B82F6'
      });
    }
  }, [category]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={handleNameChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            required
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <div className="mt-1 flex items-center space-x-3">
            <input
              type="color"
              id="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
            />
            <span className="text-sm text-gray-500">{formData.color}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {category ? 'Actualizar Categoría' : 'Crear Categoría'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;