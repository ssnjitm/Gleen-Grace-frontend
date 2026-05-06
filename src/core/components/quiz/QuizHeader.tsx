import React from 'react';
import { ArrowLeft, Eye, EyeOff, Save, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizHeaderProps {
  quizTitle: string;
  quizDescription: string;
  showPreview: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTogglePreview: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isEditing?: boolean;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  quizTitle,
  quizDescription,
  showPreview,
  onTitleChange,
  onDescriptionChange,
  onTogglePreview,
  onSave,
  isSaving = false,
  isEditing = false,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/quiz')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
            <div>
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                className="text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 px-0 py-0 w-64 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                placeholder="Quiz Title"
              />
              <textarea
                value={quizDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Add a description..."
                className="block text-xs text-gray-500 dark:text-gray-400 bg-transparent border-none focus:outline-none px-0 mt-0.5 w-80 resize-none"
                rows={1}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onTogglePreview}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                showPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditing ? 'Update Quiz' : 'Save Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizHeader;