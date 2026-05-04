import React from 'react';
import { 
  X, 
  Settings, 
  LogOut,
  ClipboardList,
  Gamepad2,
  Users,
  BookOpen,
  Bell
} from 'lucide-react';
import type { FeatureCardData } from '../../types/dashboard.types';
// import { FeatureCardData } from '../types/dashboard.types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  features: FeatureCardData[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

const getIcon = (iconName: string) => {
  const iconProps = { className: "w-5 h-5" };
  switch (iconName) {
    case 'ClipboardList':
      return <ClipboardList {...iconProps} />;
    case 'Gamepad2':
      return <Gamepad2 {...iconProps} />;
    case 'Users':
      return <Users {...iconProps} />;
    case 'BookOpen':
      return <BookOpen {...iconProps} />;
    case 'Bell':
      return <Bell {...iconProps} />;
    default:
      return <ClipboardList {...iconProps} />;
  }
};

const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    'bg-blue-500': 'bg-blue-500',
    'bg-purple-500': 'bg-purple-500',
    'bg-green-500': 'bg-green-500',
    'bg-orange-500': 'bg-orange-500',
    'bg-red-500': 'bg-red-500',
  };
  return colorMap[color] || 'bg-blue-500';
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  features,
  onNavigate,
  onLogout,
  isLoggingOut,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => {
                  onNavigate(feature.path);
                  onClose();
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left group"
              >
                <div className={`${getColorClass(feature.color)} text-white p-2 rounded-lg flex-shrink-0 transition-transform group-hover:scale-105`}>
                  {getIcon(feature.icon)}
                </div>
                <span className="font-medium flex-1">{feature.title}</span>
                {feature.badge && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    {feature.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <button
              onClick={() => {
                onNavigate('/settings');
                onClose();
              }}
              className="flex items-center space-x-3 px-4 py-3 w-full text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-5 h-5" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};