import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, LayoutGrid, List, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBulkDeleteQuizzes, useCategories, useDeleteQuiz, useQuizzes } from './hooks/useQuizQueries';
import { Card } from '../../core/components/ui/Card';
import { Button } from '../../core/components/ui/Button';
import { Input } from '../../core/components/ui/Input';
import { QuizCard } from '../../core/components/quiz/QuizCard';
import { useQuizUIStore } from '../../store/quizUIStore';


export const QuizList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 12;
  
  const { 
    filters, 
    selectedQuizIds, 
    viewMode, 
    setFilters, 
    resetFilters, 
    toggleSelectQuiz, 
    selectAllQuizzes, 
    clearSelectedQuizzes, 
    setViewMode } = useQuizUIStore();
  const { data: quizzesData, isLoading, isError, error } = useQuizzes({ ...filters, page, limit });
  const { data: categories } = useCategories();
  const deleteQuiz = useDeleteQuiz();
  const bulkDelete = useBulkDeleteQuizzes();
  
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    setFilters({ search: searchInput });
    setPage(1);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz.mutate(id);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedQuizIds.length} quizzes?`)) {
      bulkDelete.mutate(selectedQuizIds);
    }
  };

  const quizzes = quizzesData?.quizzes || [];
  const metadata = quizzesData?.metadata;
  const totalPages = metadata?.totalPages || 1;

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">Error: {(error as any)?.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
            Quiz Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create, manage, and organize your quizzes
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search quizzes..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={<Filter className="w-4 h-4" />}
              >
                Filters
                {(filters.category || filters.sortBy !== 'createdAt') && (
                  <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </Button>
              {selectedQuizIds.length > 0 && (
                <Button variant="danger" onClick={handleBulkDelete} loading={bulkDelete.isPending}>
                  Delete ({selectedQuizIds.length})
                </Button>
              )}
              <Button onClick={() => navigate('/dashboard/quiz/create')} icon={<Plus className="w-4 h-4" />}>
                Create Quiz
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => {
                      setFilters({ category: e.target.value });
                      setPage(1);
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ sortBy: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="updatedAt">Date Updated</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => setFilters({ sortOrder: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {quizzes.length} of {metadata?.totalSets || 0} quizzes
          </p>
          {quizzes.length > 0 && (
            <button
              onClick={() => {
                if (selectedQuizIds.length === quizzes.length) {
                  clearSelectedQuizzes();
                } else {
                  selectAllQuizzes(quizzes.map(q => q._id));
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {selectedQuizIds.length === quizzes.length ? 'Clear All' : 'Select All'}
            </button>
          )}
        </div>

        {/* Quiz Grid */}
        {isLoading && page === 1 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </Card>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">No quizzes found</p>
            <Button onClick={() => navigate('/dashboard/quiz/create')}>
              Create Your First Quiz
            </Button>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz._id}
                quiz={quiz}
                isSelected={selectedQuizIds.includes(quiz._id)}
                onToggleSelect={() => toggleSelectQuiz(quiz._id)}
                onDelete={() => handleDelete(quiz._id)}
                isDeleting={deleteQuiz.isPending && deleteQuiz.variables === quiz._id}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};