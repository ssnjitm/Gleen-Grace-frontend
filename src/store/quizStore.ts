import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface QuizUIState {
  // UI State only
  selectedQuizIds: string[];
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedQuizId: string | null;
  filters: {
    search: string;
    category: string;
    sortBy: 'title' | 'createdAt' | 'updatedAt';
    sortOrder: 'asc' | 'desc';
  };
  
  // UI Actions only
  toggleSelectQuiz: (quizId: string) => void;
  selectAllQuizzes: (quizIds: string[]) => void;
  clearSelectedQuizzes: () => void;
  setFilters: (filters: Partial<{ search: string; category: string; sortBy: 'title' | 'createdAt' | 'updatedAt'; sortOrder: 'asc' | 'desc' }>) => void;
  resetFilters: () => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (quizId: string) => void;
  closeEditModal: () => void;
  openDeleteModal: (quizId: string) => void;
  closeDeleteModal: () => void;
}

const initialFilters = {
  search: '',
  category: '',
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
};

export const useQuizStore = create<QuizUIState>()(
  devtools(
    (set) => ({
      selectedQuizIds: [],
      isCreateModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      selectedQuizId: null,
      filters: initialFilters,

      toggleSelectQuiz: (quizId) =>
        set((state) => ({
          selectedQuizIds: state.selectedQuizIds.includes(quizId)
            ? state.selectedQuizIds.filter(id => id !== quizId)
            : [...state.selectedQuizIds, quizId]
        })),
      
      selectAllQuizzes: (quizIds) => set({ selectedQuizIds: quizIds }),
      
      clearSelectedQuizzes: () => set({ selectedQuizIds: [] }),
      
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
      
      resetFilters: () => set({ filters: initialFilters }),
      
      openCreateModal: () => set({ isCreateModalOpen: true }),
      closeCreateModal: () => set({ isCreateModalOpen: false }),
      
      openEditModal: (quizId) => set({ isEditModalOpen: true, selectedQuizId: quizId }),
      closeEditModal: () => set({ isEditModalOpen: false, selectedQuizId: null }),
      
      openDeleteModal: (quizId) => set({ isDeleteModalOpen: true, selectedQuizId: quizId }),
      closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedQuizId: null }),
    }),
    { name: 'quiz-ui-store' }
  )
);