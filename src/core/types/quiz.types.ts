// Question Types
export interface MediaAttachment {
  type: 'image' | 'audio' | 'video';
  url?: string;
  fileName?: string;
  fileSize?: number;
}

export interface QuestionFormData {
  id: string;
  text: string;
  type: 'mcq' | 'truefalse' | 'writing';
  options: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
  media: MediaAttachment[];
}

// Quiz Form Data (for creating/updating)
export interface QuizFormData {
  title: string;
  description: string;
  questions: Omit<QuestionFormData, 'id'>[]; // Remove id for backend
  categoryIds: string[];
  time_limit?: number; // Added time_limit field
  passing_score?: number; // Optional passing score
  shuffle_questions?: boolean; // Optional shuffle setting
}

// Backend response types
export interface QuizSetDB {
  _id: string;
  title: string;
  description?: string;
  questions: QuestionFormData[];
  createdAt: string;
  updatedAt: string;
  categoryIds?: string[];
  time_limit?: number;
  passing_score?: number;
  shuffle_questions?: boolean;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  sets: string[];
  createdAt?: string;
  updatedAt?: string;
}

// API Response wrapper
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

// Filter Types
export interface QuizFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface QuizQueryParams extends QuizFilters {}