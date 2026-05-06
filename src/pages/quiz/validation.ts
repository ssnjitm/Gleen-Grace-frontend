import type { QuestionFormData } from "../../core/types/quiz.types";

export const getValidationErrors = (
  title: string,
  category: string | null,
  questions: QuestionFormData[]
): string[] => {
  const errors: string[] = [];

  // Validate title
  if (!title.trim() || title === 'Untitled Quiz') {
    errors.push('Please enter a valid quiz title');
  }

  // Validate category
  if (!category) {
    errors.push('Please select a category for this quiz');
  }

  // Validate questions
  if (questions.length === 0) {
    errors.push('Add at least one question to your quiz');
  }

  questions.forEach((question, index) => {
    if (!question.text.trim()) {
      errors.push(`Question ${index + 1}: Question text is required`);
    }

    if (question.type === 'mcq') {
      const hasEmptyOption = question.options.some(opt => !opt.trim());
      if (hasEmptyOption) {
        errors.push(`Question ${index + 1}: All options must have text`);
      }
      
      if (!question.correctAnswer) {
        errors.push(`Question ${index + 1}: Please select the correct answer`);
      }
    }

    if (question.type === 'truefalse') {
      if (!question.correctAnswer) {
        errors.push(`Question ${index + 1}: Please select True or False as the correct answer`);
      }
    }

    if (question.points <= 0) {
      errors.push(`Question ${index + 1}: Points must be greater than 0`);
    }
  });

  return errors;
};