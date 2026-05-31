import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '../../../core/config/axios';
import type { QuizFormData, QuizQueryParams, QuizSetDB } from '../../../core/types/quiz.types';
import { useQuizUIStore } from '../../../store/quizUIStore';
import type { Category } from '../../../core/types/quizTypes';

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
export const useQuizById = (id: string | null) => {
  const { setCurrentQuiz } = useQuizUIStore();
  
  return useQuery({
    queryKey: quizKeys.detail(id!),
    queryFn: async () => {
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
export const useCategories = () => {
  return useQuery({
    queryKey: quizKeys.categories(),
    queryFn: async () => {
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

// // Update quiz mutation
// export const useUpdateQuiz = () => {
//   const queryClient = useQueryClient();
//   const { closeEditModal } = useQuizUIStore();
  
//   return useMutation({
//     mutationFn: async ({ id, data }: { id: string; data: Partial<QuizFormData> }) => {
//       const response = await api.patch(`/quiz-sets/${id}`, data);
//       return response.data.data as QuizSetDB;
//     },
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: quizKeys.detail(variables.id) });
//       toast.success('Quiz updated successfully!');
//       closeEditModal();
//     },
//     onError: (error: any) => {
//       toast.error(error?.response?.data?.message || 'Failed to update quiz');
//     },
//   })
// };

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  const { closeEditModal } = useQuizUIStore();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<QuizFormData> }) => {
      const { _id, id: clientId, createdAt, updatedAt, ...cleanData } = data as any;

      if (cleanData.category && typeof cleanData.category === 'object') {
        cleanData.category = cleanData.category._id || cleanData.category.id;
      }

      if (cleanData.questions && Array.isArray(cleanData.questions)) {
        cleanData.questions = cleanData.questions.map((q: any, idx: number) => {
          // Normalize the question type structure to match backend strings
          let matchedType = q.type;
          if (matchedType === 'mcq') matchedType = "MCQ";
          if (matchedType === 'truefalse') matchedType = "TRUE_FALSE";

          // Guarantee valid array properties to satisfy Mongoose length validators
          let processedOptions = Array.isArray(q.options) ? q.options : [];
          if (matchedType === "TRUE_FALSE" && processedOptions.length !== 2) {
            processedOptions = ["True", "False"];
          }

          // Map client string answers back to schema numeric indexes safely
          let mappedIndex = Number(q.correctAnswerIndex);
          if (isNaN(mappedIndex) && q.correctAnswer !== undefined) {
            mappedIndex = processedOptions.indexOf(q.correctAnswer);
          }

          return {
            questionNo: Number(q.questionNo) || (idx + 1),
            type: matchedType,
            text: q.text || "",
            options: processedOptions,
            // 🌟 Match the exact schema name (correctAnswerIndex instead of correctAnswer)
            correctAnswerIndex: mappedIndex >= 0 ? mappedIndex : 0,
            explanation: q.explanation || ""
          };
        });
      }

      const response = await api.patch(`/quiz-sets/${id}`, cleanData);
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


// Update your hook inside useQuizQueries.ts:
// export const useUpdateQuiz = () => {
//   const queryClient = useQueryClient();
//   const { closeEditModal } = useQuizUIStore();
  
//   return useMutation({
//     mutationFn: async ({ id, data }: { id: string; data: Partial<QuizFormData> }) => {
//       // 🌟 Destructure and omit read-only fields that cause Mongoose schema re-assignment failures
//       const { _id, id: clientId, createdAt, updatedAt, ...sanitizedPayload } = data as any;

//       // If data contains an inline array of questions, clean up individual question IDs too
//       if (sanitizedPayload.questions && Array.isArray(sanitizedPayload.questions)) {
//         sanitizedPayload.questions = sanitizedPayload.questions.map(({ _id, ...q }) => q);
//       }

//       const response = await api.patch(`/quiz-sets/${id}`, sanitizedPayload);
//       return response.data.data as QuizSetDB;
//     },
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: quizKeys.detail(variables.id) });
//       toast.success('Quiz updated successfully!');
//       closeEditModal();
//     },
//     onError: (error: any) => {
//       toast.error(error?.response?.data?.message || 'Failed to update quiz');
//     },
//   });
// };

// Delete quiz mutation
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  const { closeDeleteModal, selectedQuizIds, clearSelectedQuizzes } = useQuizUIStore();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // ✅ Fixed: Removed "/update" to target clean REST endpoint DELETE /api/v1/quiz-sets/:id
      await api.delete(`/quiz-sets/${id}`);
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
      // ✅ Fixed: Removed "/update" here as well
      await Promise.all(ids.map(id => api.delete(`/quiz-sets/${id}`)));
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