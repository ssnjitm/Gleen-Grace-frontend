import  { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Copy, BarChart3, Settings, Share2, Download, Clock, Users, FileText } from 'lucide-react';
import { useQuizById, useDeleteQuiz } from './hooks/useQuizQueries';
import { Button } from '../../core/components/ui/Button';
import { Card } from '../../core/components/ui/Card';
import { cn } from '../../core/utils/cn';

type TabType = 'overview' | 'questions' | 'analytics' | 'settings';

export const QuizDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const { data: quiz, isLoading, isError } = useQuizById(id || null);
  const deleteQuiz = useDeleteQuiz();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz.mutate(id!, {
        onSuccess: () => navigate('/dashboard/quiz'),
      });
    }
  };

  const handleDuplicate = () => {
    // Implement duplicate logic
    console.log('Duplicate quiz:', id);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'questions', label: 'Questions', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4" />
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">Quiz not found</p>
          <Button onClick={() => navigate('/dashboard/quiz')}>Back to Quizzes</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard/quiz')}
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {quiz.title}
                  </h1>
                  {quiz.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {quiz.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDuplicate}
                  icon={<Copy className="w-4 h-4" />}
                >
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/quiz/edit/${id}`)}
                  icon={<Edit2 className="w-4 h-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  loading={deleteQuiz.isPending}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative',
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {quiz.questions.length}
                    </p>
                    <p className="text-sm text-gray-500">Questions</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                    <p className="text-sm text-gray-500">Total Attempts</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Created</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(quiz.updatedAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Last Updated</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate(`/dashboard/quiz/edit/${id}`)}
                  icon={<Edit2 className="w-4 h-4" />}
                >
                  Edit Quiz
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/dashboard/quiz/${id}/analytics`)}
                  icon={<BarChart3 className="w-4 h-4" />}
                >
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  icon={<Share2 className="w-4 h-4" />}
                >
                  Share Quiz
                </Button>
                <Button
                  variant="outline"
                  icon={<Download className="w-4 h-4" />}
                >
                  Export Data
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <Card key={question.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full">
                      Q{index + 1}
                    </span>
                    <span className="text-xs text-gray-500">{question.points} pts</span>
                  </div>
                  <span className="text-xs text-gray-500 capitalize px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {question.type === 'mcq' ? 'Multiple Choice' : 
                     question.type === 'truefalse' ? 'True/False' : 'Essay'}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white mb-4">{question.text}</p>
                {question.type === 'mcq' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          question.correctAnswer === option
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {question.correctAnswer === option && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <Card className="p-6">
            <p className="text-gray-500 text-center py-12">
              Analytics data will appear here once students start taking the quiz.
            </p>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Quiz Settings
                </h3>
                <p className="text-sm text-gray-500">
                  Configure quiz timing, scoring, and accessibility options.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <Button variant="danger" onClick={handleDelete}>
                  Delete Quiz
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};