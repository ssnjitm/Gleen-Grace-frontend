import React from 'react';
import { Eye, CheckCircle, Image, Music, Video, FileText, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/cn';


interface PreviewPanelProps {
  quizTitle: string;
  quizDescription: string;
  questions: Array<{
    id: string;
    text: string;
    type: 'mcq' | 'truefalse' | 'writing';
    options: string[];
    correctAnswer: string | string[];
    points: number;
    media: Array<{ type: 'image' | 'audio' | 'video'; url?: string }>;
  }>;
  activeQuestionId?: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  quizTitle,
  quizDescription,
  questions,
  activeQuestionId
}) => {
  const getMediaIcon = (type: string) => {
    switch(type) {
      case 'image': return <Image className="w-3 h-3" />;
      case 'audio': return <Music className="w-3 h-3" />;
      case 'video': return <Video className="w-3 h-3" />;
      default: return <HelpCircle className="w-3 h-3" />;
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24 h-[calc(100vh-120px)] flex flex-col">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-5 py-4">
        <div className="flex items-center gap-2 text-white">
          <Eye className="w-4 h-4" />
          <h3 className="font-semibold text-sm">Live Preview</h3>
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Quiz Info */}
        <div className="mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
            {quizTitle || 'Untitled Quiz'}
          </h4>
          {quizDescription && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{quizDescription}</p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span>{questions.length} {questions.length === 1 ? 'question' : 'questions'}</span>
            <span>•</span>
            <span>{totalPoints} total points</span>
          </div>
        </div>

        {/* Questions Preview */}
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div 
              key={question.id}
              className={
                cn(
                'p-4 rounded-xl transition-all duration-200',
                activeQuestionId === question.id 
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-2 border-blue-200 dark:border-blue-800 shadow-md' 
                  : 'bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
              )}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
                    Q{index + 1}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{question.points} pts</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 capitalize px-2 py-0.5 bg-white dark:bg-gray-800 rounded-full">
                  {question.type === 'mcq' ? 'Multiple Choice' : 
                   question.type === 'truefalse' ? 'True/False' : 'Essay'}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                {question.text || 'Click to add question text'}
              </p>

              {/* Media Indicators */}
              {question.media && question.media.length > 0 && (
                <div className="flex gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  {question.media.map((media, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {getMediaIcon(media.type)}
                      <span className="capitalize">{media.type}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Options Preview */}
              {question.type === 'mcq' && question.options && question.options.length > 0 && (
                <div className="space-y-2">
                  {question.options.map((option, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2 text-sm">
                      <div className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        question.correctAnswer === option 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      )}>
                        {question.correctAnswer === option && (
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      <span className={cn(
                        'text-gray-700 dark:text-gray-300',
                        question.correctAnswer === option && 'font-medium text-green-700 dark:text-green-400'
                      )}>
                        {option || `Option ${String.fromCharCode(65 + optIdx)}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'truefalse' && (
                <div className="flex gap-4">
                  {['true', 'false'].map((value) => (
                    <div key={value} className="flex items-center gap-2 text-sm">
                      <div className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        question.correctAnswer === value 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      )}>
                        {question.correctAnswer === value && (
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        )}
                      </div>
                      <span className={cn(
                        'text-gray-700 dark:text-gray-300 capitalize',
                        question.correctAnswer === value && 'font-medium text-green-700 dark:text-green-400'
                      )}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'writing' && (
                <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500 mb-1" />
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">Essay answer field</p>
                </div>
              )}
            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <p className="text-sm">No questions added yet</p>
              <p className="text-xs mt-1">Click "Add Question" to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          This is how students will see your quiz
        </p>
      </div>
    </div>
  );
};

export default PreviewPanel;