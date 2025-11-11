import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  Image, 
  Users,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('navigation.dashboard') },
    { path: '/posts', icon: FileText, label: t('navigation.posts') },
    { path: '/categories', icon: Folder, label: t('navigation.categories') },
    { path: '/media', icon: Image, label: t('navigation.media') },
    { path: '/users', icon: Users, label: t('navigation.users') },
    { path: '/settings', icon: Settings, label: t('navigation.settings') },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold">CMS Portal</h1>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white ${
                isActive ? 'bg-gray-900 text-white' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
