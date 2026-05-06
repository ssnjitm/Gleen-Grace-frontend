import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { QuizSetDB } from '../core/types/quiz.types';
import type { QuizFilters } from '../core/types/quizTypes';

interface QuizUIState {
  // Selection
  selectedQuizIds: string[];
  
  // Modals
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedQuizId: string | null;
  
  // Current editing quiz
  currentQuiz: QuizSetDB | null;
  
  // Filters
  filters: Omit<QuizFilters, 'page' | 'limit'>;
  
  // UI State
  sidebarOpen: boolean;
  viewMode: 'grid' | 'list';
  
  // Actions
  toggleSelectQuiz: (quizId: string) => void;
  selectAllQuizzes: (quizIds: string[]) => void;
  clearSelectedQuizzes: () => void;
  
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (quizId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (quizId: string) => void;
  closeDeleteModal: () => void;
  
  setCurrentQuiz: (quiz: QuizSetDB | null) => void;
  setFilters: (filters: Partial<Omit<QuizFilters, 'page' | 'limit'>>) => void;
  resetFilters: () => void;
  
  toggleSidebar: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

const initialFilters = {
  search: '',
  category: '',
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
};

export const useQuizUIStore = create<QuizUIState>()(
  devtools(
    (set) => ({
      selectedQuizIds: [],
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      selectedQuizId: null,
      currentQuiz: null,
      filters: initialFilters,
      sidebarOpen: false,
      viewMode: 'list',

      toggleSelectQuiz: (quizId) =>
        set((state) => ({
          selectedQuizIds: state.selectedQuizIds.includes(quizId)
            ? state.selectedQuizIds.filter(id => id !== quizId)
            : [...state.selectedQuizIds, quizId]
        })),
      
      selectAllQuizzes: (quizIds) => set({ selectedQuizIds: quizIds }),
      
      clearSelectedQuizzes: () => set({ selectedQuizIds: [] }),
      
      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),
      
      openEditModal: (quizId) => set({ isEditModalOpen: true, selectedQuizId: quizId }),
      closeEditModal: () => set({ isEditModalOpen: false, selectedQuizId: null }),
      
      openDeleteModal: (quizId) => set({ isDeleteModalOpen: true, selectedQuizId: quizId }),
      closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedQuizId: null }),
      
      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
      
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
      
      resetFilters: () => set({ filters: initialFilters }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    { name: 'quiz-ui-store' }
  )
);