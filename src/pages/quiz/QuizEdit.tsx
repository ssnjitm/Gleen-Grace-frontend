import { useParams, useNavigate } from 'react-router-dom';
import { useQuizById } from './hooks/useQuizQueries';
import { Loader } from 'lucide-react';
import { Card } from '../../core/components/ui/Card';
import { Button } from '../../core/components/ui/Button';
import QuizCreator from './QuizCreator';


export const QuizEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quiz, isLoading, isError } = useQuizById(id || null);
//   const updateQuiz = useUpdateQuiz();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-red-600 mb-4">Quiz not found</p>
          <Button onClick={() => navigate('/dashboard/quiz')}>Back to Quizzes</Button>
        </Card>
      </div>
    );
  }

  // Pass the quiz data to QuizCreator for editing
  return <QuizCreator initialQuiz={quiz} isEditing={true} />;
};