import React from 'react';
import { ChevronRight, ClipboardList, Gamepad2 } from 'lucide-react';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: 'quiz' | 'puzzle';
  color: string;
  path: string;
  onNavigate: (path: string) => void;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  description,
  icon,
  color,
  path,
  onNavigate,
}) => {
  const IconComponent = icon === 'quiz' ? ClipboardList : Gamepad2;
  const gradientClass = color === 'blue' 
    ? 'from-blue-500 to-blue-600' 
    : 'from-purple-500 to-purple-600';

  return (
    <div
      onClick={() => onNavigate(path)}
      className={`bg-gradient-to-br ${gradientClass} rounded-lg shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="bg-white/20 w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4">
            <IconComponent className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/90 text-sm mb-4">{description}</p>
          <div className="flex items-center text-white">
            <span className="text-sm font-medium">Explore {title}</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
        <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
          Active
        </div>
      </div>
    </div>
  );
};