import React from 'react';
import { Plus, X, Image, Music, Video } from 'lucide-react';
import type { QuestionFormData } from '../../types/quiz.types';
import { cn } from '../../utils/cn';


interface QuestionTabsProps {
  questions: QuestionFormData[];
  activeQuestionId: string;
  onQuestionSelect: (id: string) => void;
  onAddQuestion: () => void;
  onDeleteQuestion: (id: string, index: number) => void;
}

const QuestionTabs: React.FC<QuestionTabsProps> = ({
  questions,
  activeQuestionId,
  onQuestionSelect,
  onAddQuestion,
  onDeleteQuestion,
}) => {
  const hasMedia = (question: QuestionFormData) => {
    return question.media && question.media.length > 0;
  };

  const getMediaIcon = (question: QuestionFormData) => {
    if (!question.media) return null;
    const types = question.media.map(m => m.type);
    if (types.includes('image')) return <Image className="w-3 h-3" />;
    if (types.includes('video')) return <Video className="w-3 h-3" />;
    if (types.includes('audio')) return <Music className="w-3 h-3" />;
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900 dark:text-white">Questions</h2>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {questions.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onAddQuestion}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>
      
     <div className="p-4">
  <div className="flex flex-wrap gap-2">
    {questions.map((question, index) => (
      /* Changed from <button> to <div> */
      <div
        key={question.id}
        role="button" // Accessibility: informs screen readers this is clickable
        tabIndex={0}  // Accessibility: makes the div focusable via keyboard
        onClick={() => onQuestionSelect(question.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onQuestionSelect(question.id);
        }}
        className={cn(
          'group relative px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-sm cursor-pointer select-none',
          activeQuestionId === question.id
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        )}
      >
        <span className="font-medium">Q{index + 1}</span>
        
        {hasMedia(question) && (
          <span className="text-xs opacity-70">
            {getMediaIcon(question)}
          </span>
        )}

        {question.text && (
          <span className="max-w-[100px] truncate text-xs opacity-80">
            {question.text.length > 20 ? question.text.substring(0, 20) + '...' : question.text}
          </span>
        )}

        {questions.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevents onQuestionSelect from firing
              onDeleteQuestion(question.id, index);
            }}
            className={cn(
              'absolute -top-1 -right-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
              activeQuestionId === question.id
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            )}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default QuestionTabs;