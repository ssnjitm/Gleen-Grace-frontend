import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';
import type { QuizFormData, QuizQueryParams, QuizSetDB } from '../../../core/types/quiz.types';
import { useQuizUIStore } from '../../../store/quizUIStore';
import type { Category } from '../../../core/types/quizTypes';
// import { QuizSetDB, QuizFormData, QuizQueryParams, Category } from '../../../types/quiz.types';
// import { useQuizUIStore } from '../store/quizUIStore';

// Query Keys
export const quizKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizKeys.all, 'list'] as const,
  list: (params: QuizQueryParams) => [...quizKeys.lists(), params] as const,
  details: () => [...quizKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
  categories: () => [...quizKeys.all, 'categories'] as const,
};

// Fetch all quizzes
export const useQuizzes = (params: QuizQueryParams) => {
  return useQuery({
    queryKey: quizKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.append('page', String(params.page));
      searchParams.append('limit', String(params.limit));
      if (params.search) searchParams.append('search', params.search);
      if (params.category) searchParams.append('category', params.category);
      if (params.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
      
      const response = await api.get(`/quiz-sets/all-quizes?${searchParams.toString()}`);
      return {
        quizzes: response.data.data as QuizSetDB[],
        metadata: response.data.metadata,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Fetch single quiz
// export const useQuizById = (id: string | null) => {
//   const { setCurrentQuiz } = useQuizUIStore();
  
//   return useQuery({
//     queryKey: quizKeys.detail(id!),
//     queryFn: async () => {
//       const response = await api.get(`/quiz-sets/${id}`);
//       const quiz = response.data.data;
//       setCurrentQuiz(quiz);
//       return quiz as QuizSetDB;
//     },
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000,
//   });
// };
export const useQuizById = (id: string | null) => {
  const { setCurrentQuiz } = useQuizUIStore();
  
  return useQuery({
    queryKey: quizKeys.detail(id!),
    queryFn: async () => {
      // Ensure this matches your backend "Get Single Quiz" route
      const response = await api.get(`/quiz-sets/${id}`); 
      const quiz = response.data.data;
      setCurrentQuiz(quiz);
      return quiz as QuizSetDB;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
// Fetch categories
// export const useCategories = () => {
//   return useQuery({
//     queryKey: quizKeys.categories(),
//     queryFn: async () => {
//       const response = await api.get('/categories');
//       return response.data.data as Category[];
//     },
//     staleTime: 30 * 60 * 1000,
//   });
// };

// In useQuizQueries.ts
export const useCategories = () => {
  return useQuery({
    queryKey: quizKeys.categories(),
    queryFn: async () => {
      // Change from '/categories' to '/quiz-sets/categories'
      const response = await api.get('/quiz-sets/categories');
      return response.data.data as Category[];
    },
    staleTime: 30 * 60 * 1000,
  });
};

// Create quiz mutation
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  const { closeCreateModal } = useQuizUIStore();
  
  return useMutation({
    mutationFn: async (data: QuizFormData) => {
      const response = await api.post('/quiz-sets/create', data);
      return response.data.data as QuizSetDB;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      toast.success('Quiz created successfully!');
      closeCreateModal();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create quiz');
    },
  });
};



// Update quiz mutation
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  const { closeEditModal } = useQuizUIStore();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<QuizFormData> }) => {
      const response = await api.patch(`/quiz-sets/update/${id}`, data);
      return response.data.data as QuizSetDB;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quizKeys.detail(variables.id) });
      toast.success('Quiz updated successfully!');
      closeEditModal();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update quiz');
    },
  });
};

// Delete quiz mutation
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  const { closeDeleteModal, selectedQuizIds, clearSelectedQuizzes } = useQuizUIStore();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/quiz-sets/update/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      toast.success('Quiz deleted successfully!');
      closeDeleteModal();
      
      if (selectedQuizIds.includes(deletedId)) {
        clearSelectedQuizzes();
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete quiz');
    },
  });
};

// Bulk delete mutations
export const useBulkDeleteQuizzes = () => {
  const queryClient = useQueryClient();
  const { clearSelectedQuizzes } = useQuizUIStore();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => api.delete(`/quiz-sets/update/${id}`)));
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      toast.success('Quizzes deleted successfully!');
      clearSelectedQuizzes();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete quizzes');
    },
  });
};

