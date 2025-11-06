import React, { useState, useEffect } from 'react';
import { Post, Category } from '../../types';
import { categoriesAPI } from '../../services/api';
import { generateSlug } from '../../utils/helpers';
import Button from '../UI/Button';

interface PostFormProps {
  post?: Post;
  onSubmit: (post: Omit<Post, 'id'> | Post) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSubmit, onCancel, loading = false }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    category: '',
    tags: '',
    featuredImage: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        category: post.category,
        tags: post.tags.join(', '),
        featuredImage: post.featuredImage || ''
      });
    }
  }, [post]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      authorId: 1, // En un caso real, esto vendría del usuario autenticado
      createdAt: post?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(formData.status === 'published' && !post?.publishedAt && { 
        publishedAt: new Date().toISOString() 
      })
    };

    onSubmit(postData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={handleTitleChange}
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
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Extracto
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Contenido *
          </label>
          <textarea
            id="content"
            rows={10}
            required
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Estado *
            </label>
            <select
              id="status"
              required
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'archived' }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Etiquetas
          </label>
          <input
            type="text"
            id="tags"
            placeholder="Separar por comas"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
            Imagen Destacada
          </label>
          <input
            type="url"
            id="featuredImage"
            placeholder="URL de la imagen"
            value={formData.featuredImage}
            onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
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
          {post ? 'Actualizar Post' : 'Crear Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;