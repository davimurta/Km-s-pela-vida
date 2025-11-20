import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">KM's Pela Vida</h3>
            <p className="text-gray-400 mb-4">Promovendo qualidade de vida através do esporte</p>
            <p className="text-gray-500 text-sm">© 2024 KM's Pela Vida. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
