import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { useQuizById } from './hooks/useQuizQueries';
import { Button } from '../../core/components/ui/Button';
import { Card } from '../../core/components/ui/Card';


export const QuizAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading } = useQuizById(id || null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/quiz/${id}`)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Quiz
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quiz Analytics: {quiz?.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track performance and engagement metrics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-sm text-gray-500">Total Attempts</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-sm text-gray-500">Unique Students</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0%</p>
                <p className="text-sm text-gray-500">Average Score</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-sm text-gray-500">Avg. Completion Time</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 text-center">
          <p className="text-gray-500">
            Analytics data will appear here once students start taking the quiz.
          </p>
        </Card>
      </div>
    </div>
  );
};