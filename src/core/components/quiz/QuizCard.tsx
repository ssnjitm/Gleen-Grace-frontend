import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Edit2, Trash2, Eye, CheckSquare, Square } from 'lucide-react';
import type { QuizSetDB } from '../../types/quiz.types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
// import { QuizSetDB } from '../../../../types/quiz.types';
// import { Card } from '../../../../core/components/ui/Card';
// import { Button } from '../../../../core/components/ui/Button';
// import { cn } from '../../../../utils/cn';

interface QuizCardProps {
  quiz: QuizSetDB;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  viewMode: 'grid' | 'list';
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  isSelected,
  onToggleSelect,
  onDelete,
  isDeleting,
  viewMode,
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return formatDate(dateString);
  };

  if (viewMode === 'grid') {
    return (
      <Card hover className="overflow-hidden group">
        <div className="relative">
          {/* Selection Checkbox */}
          <div className="absolute top-3 left-3 z-10">
            <button
              onClick={onToggleSelect}
              className="p-1 bg-white dark:bg-gray-800 rounded-md shadow-sm"
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Card Content */}
          <div className="p-5">
            {/* Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
              {quiz.title}
            </h3>

            {/* Description */}
            {quiz.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {quiz.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span>{quiz.questions.length} questions</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatRelativeTime(quiz.updatedAt)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate(`/dashboard/quiz/${quiz._id}`)}
                icon={<Eye className="w-3 h-3" />}
              >
                View
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate(`/dashboard/quiz/edit/${quiz._id}`)}
                icon={<Edit2 className="w-3 h-3" />}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                loading={isDeleting}
                icon={<Trash2 className="w-3 h-3" />}
                className="text-red-600 hover:bg-red-50"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // List view
  return (
    <Card className={cn('p-4', isSelected && 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20')}>
      <div className="flex items-center gap-4">
        <button onClick={onToggleSelect}>
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-blue-600" />
          ) : (
            <Square className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">{quiz.title}</h3>
          {quiz.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {quiz.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <span>{quiz.questions.length} questions</span>
            <span>Updated {formatRelativeTime(quiz.updatedAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/dashboard/quiz/${quiz._id}`)}
            icon={<Eye className="w-3 h-3" />}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/dashboard/quiz/edit/${quiz._id}`)}
            icon={<Edit2 className="w-3 h-3" />}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            loading={isDeleting}
            icon={<Trash2 className="w-3 h-3" />}
            className="text-red-600 hover:bg-red-50"
          />
        </div>
      </div>
    </Card>
  );
};