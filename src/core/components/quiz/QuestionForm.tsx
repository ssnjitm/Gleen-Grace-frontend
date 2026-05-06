import React, { useRef, useEffect } from 'react';
import { Copy, Trash2, Plus, X, CheckCircle } from 'lucide-react';
import type { MediaAttachment, QuestionFormData } from '../../types/quiz.types';
import { cn } from '../../utils/cn';
import MediaUploader from './MediaUploader';


interface QuestionFormProps {
  question: QuestionFormData;
  index: number;
  expandedMediaFor: { questionId: string; type: string } | null;
  onUpdate: (id: string, updates: Partial<QuestionFormData>) => void;
  onUpdateOption: (questionId: string, index: number, value: string) => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, index: number) => void;
  onToggleMedia: (questionId: string, type: MediaAttachment['type'], mediaItem?: MediaAttachment) => void;
  onFileUpload: (questionId: string, type: MediaAttachment['type'], file: File) => void;
  onRemoveMedia: (questionId: string, type: MediaAttachment['type'], mediaItem?: MediaAttachment) => void;
  onSetExpandedMedia: (value: { questionId: string; type: string } | null) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string, index: number) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  question,
  index,
  expandedMediaFor,
  onUpdate,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onToggleMedia,
  onFileUpload,
  onRemoveMedia,
  onSetExpandedMedia,
  onDuplicate,
  onDelete,
}) => {
  const questionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (questionInputRef.current && !question.text) {
      questionInputRef.current.focus();
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-5">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Edit Question</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDuplicate(question.id)}
              className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(question.id, index)}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Question Text
          </label>
          <input
            ref={questionInputRef}
            type="text"
            value={question.text}
            onChange={(e) => onUpdate(question.id, { text: e.target.value })}
            placeholder="Enter your question here..."
            className="w-full px-4 py-2.5 text-base border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        {/* Media Attachments */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Media Attachments
          </label>
          <MediaUploader
            media={question.media}
            questionId={question.id}
            expandedMediaFor={expandedMediaFor}
            onToggleMedia={onToggleMedia}
            onFileUpload={onFileUpload}
            onRemoveMedia={onRemoveMedia}
            onSetExpanded={onSetExpandedMedia}
          />
        </div>

        {/* Question Type */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Question Type
          </label>
          <select
            value={question.type}
            onChange={(e) => {
              const newType = e.target.value as QuestionFormData['type'];
              const baseUpdate: Partial<QuestionFormData> = { type: newType };
              if (newType === 'truefalse') {
                baseUpdate.options = ['True', 'False'];
                baseUpdate.correctAnswer = '';
              } else if (newType === 'mcq') {
                baseUpdate.options = ['', '', '', ''];
                baseUpdate.correctAnswer = '';
              } else if (newType === 'writing') {
                baseUpdate.options = [];
                baseUpdate.correctAnswer = '';
              }
              onUpdate(question.id, baseUpdate);
            }}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="truefalse">True / False</option>
            <option value="writing">Writing / Essay</option>
          </select>
        </div>

        {/* MCQ Options */}
        {question.type === 'mcq' && (
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Answer Options
            </label>
            <div className="space-y-2">
              {(question.options as string[]).map((option, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={() => {
                    if (option && option.trim()) {
                      onUpdate(question.id, { correctAnswer: option });
                    }
                  }}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                      question.correctAnswer === option && option && option.trim()
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'
                    )}
                  >
                    {question.correctAnswer === option && option && option.trim() && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      onUpdateOption(question.id, idx, newValue);
                      if (question.correctAnswer === option && !newValue.trim()) {
                        onUpdate(question.id, { correctAnswer: '' });
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  
                  {(question.options as string[]).length > 2 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveOption(question.id, idx);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => onAddOption(question.id)}
              className="mt-2 text-blue-600 dark:text-blue-400 text-xs hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Option
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Click on any option to select it as the correct answer
            </p>
          </div>
        )}

        {/* True/False Options */}
        {question.type === 'truefalse' && (
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Correct Answer
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onUpdate(question.id, { correctAnswer: 'true' })}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all',
                  question.correctAnswer === 'true'
                    ? 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-400'
                )}
              >
                {question.correctAnswer === 'true' && <CheckCircle className="w-4 h-4 text-green-600" />}
                True
              </button>
              <button
                type="button"
                onClick={() => onUpdate(question.id, { correctAnswer: 'false' })}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all',
                  question.correctAnswer === 'false'
                    ? 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-400'
                )}
              >
                {question.correctAnswer === 'false' && <CheckCircle className="w-4 h-4 text-green-600" />}
                False
              </button>
            </div>
          </div>
        )}

        {/* Writing/Essay */}
        {question.type === 'writing' && (
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Answer Format
            </label>
            <textarea
              placeholder="Students will write their essay answer here..."
              disabled
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm"
              rows={2}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Open-ended question - answers will be reviewed manually
            </p>
          </div>
        )}

        {/* Points */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Points
          </label>
          <input
            type="number"
            value={question.points}
            onChange={(e) => onUpdate(question.id, { points: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-20 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        
        <br />
        
        {/* Context/Information Field */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Context & Information (Optional)
          </label>
          <textarea
            value={question.explanation || ''}
            onChange={(e) => onUpdate(question.id, { explanation: e.target.value })}
            placeholder="Add additional context, background information, or explanations for this question..."
            className="w-full px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-y bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            rows={3}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            This information will be shown to users to provide context for the question
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;