import React from 'react';
import { 
  Users, 
  ClipboardList, 
  Gamepad2, 
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import type { StatCardData } from '../../types/dashboard.types';
// import { StatCardData } from '../types/dashboard.types';

interface StatCardProps extends StatCardData {}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Users':
      return <Users className="w-6 h-6" />;
    case 'ClipboardList':
      return <ClipboardList className="w-6 h-6" />;
    case 'Gamepad2':
      return <Gamepad2 className="w-6 h-6" />;
    case 'Activity':
      return <Activity className="w-6 h-6" />;
    default:
      return <Activity className="w-6 h-6" />;
  }
};

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-4 h-4" />;
    case 'down':
      return <TrendingDown className="w-4 h-4" />;
    default:
      return <Minus className="w-4 h-4" />;
  }
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend 
}) => {
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600">
          {getIcon(icon)}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
          {getTrendIcon(trend)}
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};