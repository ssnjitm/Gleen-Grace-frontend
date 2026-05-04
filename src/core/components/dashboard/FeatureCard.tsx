import React from 'react';
import { ChevronRight } from 'lucide-react';
import { 
  ClipboardList, 
  Gamepad2, 
  Users, 
  BookOpen, 
  Bell,
  Settings 
} from 'lucide-react';
import type { FeatureCardData } from '../../types/dashboard.types';

const getIcon = (iconName: string) => {
  const iconProps = { className: "w-8 h-8" };
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
    case 'Settings':
      return <Settings {...iconProps} />;
    default:
      return <ClipboardList {...iconProps} />;
  }
};

const getColorClass = (color: string) => {
  switch (color) {
    case 'bg-blue-500':
      return 'bg-blue-500';
    case 'bg-purple-500':
      return 'bg-purple-500';
    case 'bg-green-500':
      return 'bg-green-500';
    case 'bg-orange-500':
      return 'bg-orange-500';
    case 'bg-red-500':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};

interface FeatureCardProps extends FeatureCardData {
  onNavigate: (path: string) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color,
  path,
  badge,
  onNavigate,
}) => {
  return (
    <div
      onClick={() => onNavigate(path)}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${getColorClass(color)} w-14 h-14 rounded-lg flex items-center justify-center text-white`}>
          {getIcon(icon)}
        </div>
        {badge && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center text-blue-600 text-sm font-medium">
        <span>View details</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
};