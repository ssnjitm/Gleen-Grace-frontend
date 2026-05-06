import React from 'react';
import { Settings, 
    // BookOpen, FileText, Sparkles, Calendar, Layers, Users 
} from 'lucide-react';
import { cn } from '../../utils/cn';


interface CategoryOption {
  id: string;
  label: string;
  icon: any;
  color: string;
  description?: string;
}

interface CategorySelectorProps {
  selectedCategory: string | null;
  categories: CategoryOption[];
  onSelectCategory: (categoryId: string) => void;
}

const getColorClasses = (color: string, 
    // isSelected: boolean
) => {
  const colorMap: Record<string, { bg: string; border: string; text: string; selectedBg: string }> = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      selectedBg: 'bg-blue-500',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      selectedBg: 'bg-green-500',
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-950',
      border: 'border-pink-200 dark:border-pink-800',
      text: 'text-pink-700 dark:text-pink-300',
      selectedBg: 'bg-pink-500',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      selectedBg: 'bg-purple-500',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-950',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-700 dark:text-orange-300',
      selectedBg: 'bg-orange-500',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950',
      border: 'border-indigo-200 dark:border-indigo-800',
      text: 'text-indigo-700 dark:text-indigo-300',
      selectedBg: 'bg-indigo-500',
    },
  };
  return colorMap[color] || colorMap.blue;
};

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  categories,
  onSelectCategory,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quiz Category</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const colorClasses = getColorClasses(
            cat.color, 
            // isSelected
        );
          
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left group',
                isSelected
                  ? `${colorClasses.selectedBg} text-white border-transparent shadow-md`
                  : `${colorClasses.bg} ${colorClasses.border} hover:shadow-md hover:scale-[1.02]`
              )}
            >
              <div className={cn(
                'p-2 rounded-lg transition-colors',
                isSelected ? 'bg-white/20' : colorClasses.bg
              )}>
                <Icon className={cn('w-4 h-4', isSelected ? 'text-white' : colorClasses.text)} />
              </div>
              <div className="flex-1">
                <p className={cn('text-sm font-medium', isSelected ? 'text-white' : 'text-gray-900 dark:text-white')}>
                  {cat.label}
                </p>
                {cat.description && (
                  <p className={cn('text-xs', isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400')}>
                    {cat.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;