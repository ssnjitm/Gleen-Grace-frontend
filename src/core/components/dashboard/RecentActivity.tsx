
import React from 'react';
import type { RecentActivity as RecentActivityType } from '../../types/dashboard.types';
import { 
  ClipboardList, 
  Gamepad2, 
  Users, 
  BookOpen, 
  Bell 
} from 'lucide-react';

interface RecentActivityProps {
  activities: RecentActivityType[];
  onNavigate: (path: string) => void;
  isLoading?: boolean;
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

const getIconColorClass = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-100 text-blue-600';
    case 'purple':
      return 'bg-purple-100 text-purple-600';
    case 'green':
      return 'bg-green-100 text-green-600';
    case 'orange':
      return 'bg-orange-100 text-orange-600';
    case 'red':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  activities, 
  onNavigate, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 py-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 py-3 border-b last:border-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColorClass(activity.iconColor)}`}>
              {getIcon(activity.icon)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
            <button
              onClick={() => onNavigate(activity.path)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};