import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { useDeleteQuiz, useQuizById, useUpdateQuiz } from './hooks/useQuizQueries';
import { Button } from '../../core/components/ui/Button';
import { Card } from '../../core/components/ui/Card';
import { Input } from '../../core/components/ui/Input';



export const QuizSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data:  isLoading } = useQuizById(id || null);
  const updateQuiz = useUpdateQuiz();
  const deleteQuiz = useDeleteQuiz();
  
  const [settings, setSettings] = useState({
    timeLimit: 0,
    passingScore: 70,
    shuffleQuestions: false,
    showAnswers: true,
    allowRetake: true,
  });

//   const handleSave = () => {
//     updateQuiz.mutate({
//       id: id!,
//       data: { ...settings },
//     });
//   };
const handleSave = () => {
  updateQuiz.mutate({
    id: id!,
    data: {
      // Map local state to the keys expected by QuizFormData
      time_limit: settings.timeLimit,
    //   passingScore: settings.passingScore,
    //   shuffleQuestions: settings.shuffleQuestions,
    //   showAnswers: settings.showAnswers,
    //   allowRetake: settings.allowRetake,
    },
  });
};

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      deleteQuiz.mutate(id!, {
        onSuccess: () => navigate('/dashboard/quiz'),
      });
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Quiz Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Configure how this quiz behaves for students
        </p>

        <Card className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Limit (minutes)
            </label>
            <Input
              type="number"
              min="0"
              placeholder="0 = No time limit"
              value={settings.timeLimit}
              onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Passing Score (%)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={settings.passingScore}
              onChange={(e) => setSettings({ ...settings, passingScore: parseInt(e.target.value) })}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.shuffleQuestions}
                onChange={(e) => setSettings({ ...settings, shuffleQuestions: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Shuffle questions order</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAnswers}
                onChange={(e) => setSettings({ ...settings, showAnswers: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show correct answers after submission</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRetake}
                onChange={(e) => setSettings({ ...settings, allowRetake: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Allow students to retake the quiz</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={handleSave} loading={updateQuiz.isPending} icon={<Save className="w-4 h-4" />}>
              Save Settings
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="mt-6 p-6 border-red-200 dark:border-red-900">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Once you delete a quiz, all data associated with it will be permanently removed.
          </p>
          <Button variant="danger" onClick={handleDelete} loading={deleteQuiz.isPending}>
            Delete Quiz
          </Button>
        </Card>
      </div>
    </div>
  );
};