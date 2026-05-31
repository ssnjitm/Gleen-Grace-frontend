import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface AdminFiltersProps {
  onSearchChange: (search: string) => void;
  onRoleChange: (role: string) => void;
  onVerificationChange: (verified: boolean | undefined) => void;
  onActiveChange: (active: boolean | undefined) => void;
  onReset: () => void;
  searchValue?: string;
  selectedRole?: string;
  selectedVerification?: boolean | undefined;
  selectedActive?: boolean | undefined;
}

export const AdminFilters: React.FC<AdminFiltersProps> = ({
  onSearchChange,
  onRoleChange,
  onVerificationChange,
  onActiveChange,
  onReset,
  searchValue = '',
  selectedRole = 'all',
  selectedVerification,
  selectedActive,
}) => {
  const hasActiveFilters = searchValue || selectedRole !== 'all' || selectedVerification !== undefined || selectedActive !== undefined;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, username..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="developer">Developer</option>
            <option value="editor">Editor</option>
            <option value="user">User</option>
          </select>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
          <select
            value={
              selectedVerification === undefined
                ? 'all'
                : selectedVerification
                ? 'verified'
                : 'unverified'
            }
            onChange={(e) => {
              if (e.target.value === 'all') {
                onVerificationChange(undefined);
              } else {
                onVerificationChange(e.target.value === 'verified');
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* Active Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={
              selectedActive === undefined
                ? 'all'
                : selectedActive
                ? 'active'
                : 'inactive'
            }
            onChange={(e) => {
              if (e.target.value === 'all') {
                onActiveChange(undefined);
              } else {
                onActiveChange(e.target.value === 'active');
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};
