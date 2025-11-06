import React, { useState, useEffect } from 'react';
import { postsAPI, categoriesAPI, usersAPI } from '../services/api';
import { Post } from '../types';
import { FileText, Folder, Users, Eye } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalCategories: 0,
    totalUsers: 0,
    publishedPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, categoriesRes, usersRes] = await Promise.all([
          postsAPI.getAll(),
          categoriesAPI.getAll(),
          usersAPI.getAll()
        ]);

        const posts = postsRes.data;
        const publishedPosts = posts.filter((post: Post) => post.status === 'published');

        setStats({
          totalPosts: posts.length,
          totalCategories: categoriesRes.data.length,
          totalUsers: usersRes.data.length,
          publishedPosts: publishedPosts.length,
        });

        setRecentPosts(posts.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType; color: string }> = 
    ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('text-', 'text-')}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general del sistema</p>
      </div>

 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={FileText}
          color="text-blue-600"
        />
        <StatCard
          title="Posts Publicados"
          value={stats.publishedPosts}
          icon={Eye}
          color="text-green-600"
        />
        <StatCard
          title="Categorías"
          value={stats.totalCategories}
          icon={Folder}
          color="text-purple-600"
        />
        <StatCard
          title="Usuarios"
          value={stats.totalUsers}
          icon={Users}
          color="text-orange-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Posts Recientes</h2>
        </div>
        <div className="divide-y">
          {recentPosts.map((post) => (
            <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{post.excerpt}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs text-gray-500 capitalize">{post.status}</span>
                    <span className="text-xs text-gray-500">{post.category}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : post.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;