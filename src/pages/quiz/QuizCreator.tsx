import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, GripVertical, BookOpen, FileText, Sparkles, Calendar, Layers, Users } from 'lucide-react';
import type { Category, MediaAttachment, QuestionFormData, QuizFormData, QuizSetDB } from '../../core/types/quiz.types';
import { useResize } from './hooks/useResize';
import { getValidationErrors } from './validation';
import QuizHeader from '../../core/components/quiz/QuizHeader';
import { Button } from '../../core/components/ui/Button';
import { useCategories, useCreateQuiz, useUpdateQuiz } from './hooks/useQuizQueries';
import PreviewPanel from '../../core/components/quiz/PreviewPanel';
import CategorySelector from '../../core/components/quiz/CategorySelector';
import QuestionTabs from '../../core/components/quiz/QuestionTabs';
import { ConfirmDialog } from '../../core/components/common/ConfirmDialog';
import QuestionForm from '../../core/components/quiz/QuestionForm';


interface QuizCreatorProps {
  initialQuiz?: QuizSetDB;
  isEditing?: boolean;
}

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Create default question
const createDefaultQuestion = (): QuestionFormData => ({
  id: generateId(),
  text: '',
  type: 'mcq',
  options: ['', '', '', ''],
  correctAnswer: '',
  points: 1,
  media: [],
});

const QuizCreator: React.FC<QuizCreatorProps> = ({ initialQuiz, isEditing = false }) => {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const createQuiz = useCreateQuiz();
  const updateQuiz = useUpdateQuiz();
  const { 
    previewWidth, 
    // isResizing, 
    setIsResizing } = useResize();
  
  // Quiz metadata
  const [quizTitle, setQuizTitle] = useState(initialQuiz?.title || 'Untitled Quiz');
  const [quizDescription, setQuizDescription] = useState(initialQuiz?.description || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialQuiz?.categoryIds?.[0] || null);
  const [showPreview, setShowPreview] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  
  // Questions state
  const [questions, setQuestions] = useState<QuestionFormData[]>(() => {
    if (initialQuiz?.questions) {
      return initialQuiz.questions.map(q => ({
        ...q,
        id: q.id || generateId(),
        options: q.options || (q.type === 'mcq' ? ['', '', '', ''] : []),
        correctAnswer: q.correctAnswer || '',
        points: q.points || 1,
        media: q.media || [],
      }));
    }
    return [createDefaultQuestion()];
  });
  
  const [activeQuestionId, setActiveQuestionId] = useState<string>(questions[0]?.id || '');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    questionId: string | null;
    questionIndex: number | null;
  }>({ isOpen: false, questionId: null, questionIndex: null });
  
  const [expandedMediaFor, setExpandedMediaFor] = useState<{ questionId: string; type: string } | null>(null);

  const activeQuestion = questions.find(q => q.id === activeQuestionId);
  const activeIndex = questions.findIndex(q => q.id === activeQuestionId);

  // Category options for the selector
  const categoryOptions = categories?.map((cat: Category) => ({
    id: cat._id,
    label: cat.name,
    icon: getCategoryIcon(cat.name),
    color: getCategoryColor(cat.name),
    description: cat.description,
  })) || [];

  // Helper functions for categories
  function getCategoryIcon(name: string) {
    const icons: Record<string, any> = {
      'Course': BookOpen,
      'General': FileText,
      'Daily': Sparkles,
      'Event': Calendar,
      'Series': Layers,
      'Assessment': Users,
    };
    return icons[name] || BookOpen;
  }

  function getCategoryColor(name: string) {
    const colors: Record<string, string> = {
      'Course': 'blue',
      'General': 'green',
      'Daily': 'pink',
      'Event': 'purple',
      'Series': 'orange',
      'Assessment': 'indigo',
    };
    return colors[name] || 'blue';
  }

  // Question CRUD operations
  const addQuestion = () => {
    const newQuestion = createDefaultQuestion();
    setQuestions([...questions, newQuestion]);
    setActiveQuestionId(newQuestion.id);
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    if (questionToDuplicate) {
      const duplicatedQuestion = {
        ...questionToDuplicate,
        id: generateId(),
        text: `${questionToDuplicate.text} (Copy)`,
      };
      const newQuestions = [...questions];
      const index = questions.findIndex(q => q.id === id);
      newQuestions.splice(index + 1, 0, duplicatedQuestion);
      setQuestions(newQuestions);
      setActiveQuestionId(duplicatedQuestion.id);
    }
  };

  const deleteQuestion = (id: string) => {
    if (questions.length === 1) {
      alert('You must have at least one question.');
      return;
    }
    
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    
    if (activeQuestionId === id) {
      setActiveQuestionId(newQuestions[0]?.id || '');
    }
  };

  const updateQuestion = (id: string, updates: Partial<QuestionFormData>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.type === 'mcq') {
        const newOptions = [...(q.options as string[])];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.type === 'mcq') {
        return { ...q, options: [...(q.options as string[]), ''] };
      }
      return q;
    }));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.type === 'mcq' && (q.options as string[]).length > 2) {
        const newOptions = (q.options as string[]).filter((_, i) => i !== optionIndex);
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  // Media handlers
  const toggleMedia = (questionId: string, type: MediaAttachment['type'], mediaItem?: MediaAttachment) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const hasMedia = q.media.some(m => m.type === type);
        if (hasMedia) {
          return { ...q, media: q.media.filter(m => m.type !== type) };
        } else {
          return { ...q, media: [...q.media, { type, fileName: `New ${type}` }] };
        }
      }
      return q;
    }));
  };

  const handleFileUpload = (questionId: string, type: MediaAttachment['type'], file: File) => {
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newMedia = q.media.filter(m => m.type !== type);
        return {
          ...q,
          media: [...newMedia, { type, url, fileName: file.name, fileSize: file.size }]
        };
      }
      return q;
    }));
  };

  const removeMediaFile = (questionId: string, type: MediaAttachment['type'], mediaItem?: MediaAttachment) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, media: q.media.filter(m => m.type !== type) };
      }
      return q;
    }));
  };

  // Confirm delete
  const confirmDelete = (id: string, index: number) => {
    if (questions.length === 1) {
      alert('You must have at least one question.');
      return;
    }
    setDeleteDialog({ isOpen: true, questionId: id, questionIndex: index });
  };

  const handleDeleteQuestion = () => {
    if (deleteDialog.questionId) {
      deleteQuestion(deleteDialog.questionId);
      setDeleteDialog({ isOpen: false, questionId: null, questionIndex: null });
    }
  };

  // Save quiz
  const handleSave = async () => {
    const errors = getValidationErrors(quizTitle, selectedCategory, questions);
    if (errors.length > 0) {
      alert(`Please fix the following issues:\n• ${errors.join('\n• ')}`);
      return;
    }
    
    const quizData: QuizFormData = {
      title: quizTitle,
      description: quizDescription,
      questions: questions.map(q => ({
        ...q,
        options: q.type === 'mcq' ? q.options : [],
        correctAnswer: q.correctAnswer || '',
      })),
      categoryIds: selectedCategory ? [selectedCategory] : [],
    };
    
    try {
      if (isEditing && initialQuiz?._id) {
        await updateQuiz.mutateAsync({ id: initialQuiz._id, data: quizData });
      } else {
        await createQuiz.mutateAsync(quizData);
      }
      
      setShowSaveSuccess(true);
      setTimeout(() => {
        setShowSaveSuccess(false);
        navigate('/dashboard/quiz');
      }, 2000);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const isLoading = createQuiz.isPending || updateQuiz.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              Quiz {isEditing ? 'updated' : 'saved'} successfully!
            </span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Question"
        message={`Are you sure you want to delete Question ${(deleteDialog.questionIndex ?? 0) + 1}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteQuestion}
        onCancel={() => setDeleteDialog({ isOpen: false, questionId: null, questionIndex: null })}
        type="danger"
      />

      {/* Header */}
      <QuizHeader
        quizTitle={quizTitle}
        quizDescription={quizDescription}
        showPreview={showPreview}
        onTitleChange={setQuizTitle}
        onDescriptionChange={setQuizDescription}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onSave={handleSave}
        isSaving={isLoading}
        isEditing={isEditing}
      />

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6" style={{ minHeight: 'calc(100vh - 100px)' }}>
          {/* Editor Section */}
          <div 
            className="transition-all duration-300"
            style={{ width: showPreview ? `${100 - previewWidth}%` : '100%' }}
          >
            {/* Questions Tabs */}
            <QuestionTabs
              questions={questions}
              activeQuestionId={activeQuestionId}
              onQuestionSelect={setActiveQuestionId}
              onAddQuestion={addQuestion}
              onDeleteQuestion={confirmDelete}
            />

            {/* Active Question Form */}
            {activeQuestion && (
              <QuestionForm
                question={activeQuestion}
                index={activeIndex}
                expandedMediaFor={expandedMediaFor}
                onUpdate={updateQuestion}
                onUpdateOption={updateOption}
                onAddOption={addOption}
                onRemoveOption={removeOption}
                onToggleMedia={toggleMedia}
                onFileUpload={handleFileUpload}
                onRemoveMedia={removeMediaFile}
                onSetExpandedMedia={setExpandedMediaFor}
                onDuplicate={duplicateQuestion}
                onDelete={confirmDelete}
              />
            )}

            {/* Category Selector */}
            <div className="mt-6">
              <CategorySelector
                selectedCategory={selectedCategory}
                categories={categoryOptions}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/quiz')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={isLoading}
              >
                {isEditing ? 'Update Quiz' : 'Publish Quiz'}
              </Button>
            </div>
          </div>

          {/* Resize Handle */}
          {showPreview && (
            <div 
              className="relative w-1 cursor-col-resize group"
              onMouseDown={() => setIsResizing(true)}
              onMouseUp={() => setIsResizing(false)}
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gray-200 group-hover:bg-blue-400 transition-colors rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {showPreview && (
            <div 
              className="transition-all duration-300"
              style={{ width: `${previewWidth}%` }}
            >
              <PreviewPanel
                quizTitle={quizTitle}
                quizDescription={quizDescription}
                questions={questions.map(q => ({
                  id: q.id,
                  text: q.text,
                  type: q.type === 'mcq' ? 'mcq' : q.type === 'truefalse' ? 'truefalse' : 'writing',
                  options: q.options || [],
                  correctAnswer: q.correctAnswer || '',
                  points: q.points,
                  media: q.media,
                }))}
                activeQuestionId={activeQuestionId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;