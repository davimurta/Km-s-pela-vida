import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ManageUsers } from '@/components/admin/ManageUsers';
import { ManagePosts } from '@/components/admin/ManagePosts';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('posts');

  return (
    <Layout>
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Dashboard Admin</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`${
                activeTab === 'posts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Gerenciar Posts
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Gerenciar Usuários
            </button>
          </nav>
        </div>

        {activeTab === 'posts' && <ManagePosts />}
        {activeTab === 'users' && <ManageUsers />}
      </div>
    </Layout>
  );
};
