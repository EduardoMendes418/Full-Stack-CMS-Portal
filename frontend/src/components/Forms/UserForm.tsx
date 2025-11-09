import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { validateEmail } from '../../utils/helpers';
import Button from '../UI/Button';
import { useTranslation } from 'react-i18next';

interface UserFormProps {
  user?: User;
  onSubmit: (user: Omit<User, 'id'> | User) => void;
  onCancel: () => void;
  loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'author' as 'admin' | 'editor' | 'author'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('users.errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('users.errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('users.errors.invalidEmail');
    }

    if (!user && !formData.password) {
      newErrors.password = t('users.errors.passwordRequired');
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = t('users.errors.passwordLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const userData = {
      ...formData,
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Don't send empty password in update
    if (user && !formData.password) {
      delete (userData as any).password;
    }

    onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            {t('users.fullName')} *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t('auth.email')} *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t('auth.password')} {!user && '*'}
          </label>
          <input
            type="password"
            id="password"
            placeholder={user ? t('users.keepPassword') : ''}
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            {t('users.role')} *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'editor' | 'author' }))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="author">{t('users.author')}</option>
            <option value="editor">{t('users.editor')}</option>
            <option value="admin">{t('users.admin')}</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {user ? t('common.update') : t('common.create')}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;