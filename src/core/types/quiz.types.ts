// Backend response types
export interface QuizSetDB {
  _id: string;
  title: string;
  description?: string;
  questions: QuestionDB[];
  createdAt: string;
  updatedAt: string;
  categoryIds?: string[];
}

export interface QuestionDB {
  id: string;
  text: string;
  type: 'mcq' | 'truefalse' | 'writing';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  explanation?: string;
  media?: MediaAttachment[];
}

export interface MediaAttachment {
  type: 'image' | 'audio' | 'video';
  url?: string;
  fileName?: string;
  fileSize?: number;
}

// Frontend form types
export interface QuizFormData {
  title: string;
  description: string;
  questions: QuestionFormData[];
  categoryIds: string[];
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

export interface QuizFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface QuizQueryParams extends QuizFilters {}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  sets: string[];
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