import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  userName: string;
  userInitial: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, userName, userInitial }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-4 ml-auto">
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-semibold text-gray-900">{userName}</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
};