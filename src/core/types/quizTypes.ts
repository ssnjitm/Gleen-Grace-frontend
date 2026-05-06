export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: QuestionOption[];
  correctAnswer?: string;
  points: number;
  explanation?: string;
}


// Quiz Set Types
export interface QuizSet {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  categoryIds?: string[];
}


// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  sets: string[];
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    page: number;
    limit: number;
    totalSets: number;
    totalPages: number;
  };
}

// Form Types
export interface QuizFormData {
  title: string;
  description: string;
  questions: Question[];
  categoryIds: string[];
}

// Filter Types
export interface QuizFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  //   sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortBy?: "createdAt" | "title" | "updatedAt";
  sortOrder?: 'asc' | 'desc';
}

// Store State
export interface QuizState {
  quizzes: QuizSet[];
  currentQuiz: QuizSet | null;
  categories: Category[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalQuizzes: number;
  itemsPerPage: number;
  filters: QuizFilters;
  selectedQuizIds: string[];
}

