import React, { useState } from 'react';
import { Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { AdminStatCard } from '../../../core/components/admin/AdminStatCard';
import { AdminUserTable } from '../../../core/components/admin/AdminUserTable';
import { AdminFilters } from '../../../core/components/admin/AdminFilters';
import { AdminEditUserModal } from '../../../core/components/admin/AdminEditUserModal';
import { useDashboardStats, useGetUsers, useUpdateUser, useDeleteUser, useUpdateUserRole } from './hooks/useAdminQueries';
import type { AdminUser } from '../../../core/types/admin.types';

export const AdminDashboard: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const dashboardStats = useDashboardStats();
  const users = useGetUsers({
    page,
    limit: 10,
    search,
    role: role === 'all' ? undefined : role,
    isVerified,
    isActive,
  });
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (data: any) => {
    if (!selectedUser) return;
    await updateUser.mutateAsync({ id: selectedUser._id, data });
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser.mutateAsync(userId);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUserRole.mutateAsync({ userId, role: newRole });
  };

  const handleResetFilters = () => {
    setSearch('');
    setRole('all');
    setIsVerified(undefined);
    setIsActive(undefined);
    setPage(1);
  };

  const stats = dashboardStats.data?.overview;
  const dashboardData = users.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage users, system health, and more</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users className="w-6 h-6" />}
              bgColor="bg-blue-50"
              textColor="text-blue-600"
              change={{
                value: 12,
                isPositive: true,
                label: 'this month'
              }}
            />
            <AdminStatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={<Activity className="w-6 h-6" />}
              bgColor="bg-green-50"
              textColor="text-green-600"
              change={{
                value: 5,
                isPositive: true,
                label: 'this week'
              }}
            />
            <AdminStatCard
              title="Verified Users"
              value={`${stats.completionRate}%`}
              icon={<TrendingUp className="w-6 h-6" />}
              bgColor="bg-purple-50"
              textColor="text-purple-600"
              change={{
                value: 8,
                isPositive: true,
                label: 'completion'
              }}
            />
            <AdminStatCard
              title="New Today"
              value={stats.newUsersToday}
              icon={<AlertCircle className="w-6 h-6" />}
              bgColor="bg-orange-50"
              textColor="text-orange-600"
            />
          </div>
        )}

        {/* Role Distribution */}
        {dashboardStats.data?.roles && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Distribution by Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{dashboardStats.data.roles.admin}</p>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{dashboardStats.data.roles.developer}</p>
                <p className="text-sm text-gray-600">Developers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{dashboardStats.data.roles.editor}</p>
                <p className="text-sm text-gray-600">Editors</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{dashboardStats.data.roles.user}</p>
                <p className="text-sm text-gray-600">Regular Users</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>

          {/* Filters */}
          <AdminFilters
            onSearchChange={setSearch}
            onRoleChange={setRole}
            onVerificationChange={setIsVerified}
            onActiveChange={setIsActive}
            onReset={handleResetFilters}
            searchValue={search}
            selectedRole={role}
            selectedVerification={isVerified}
            selectedActive={isActive}
          />

          {/* Users Table */}
          {dashboardData && (
            <>
              <AdminUserTable
                users={dashboardData.users}
                isLoading={users.isLoading}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onRoleChange={handleRoleChange}
              />

              {/* Pagination */}
              {dashboardData.pagination && (
                <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-6">
                  <div>
                    <p className="text-sm text-gray-600">
                      Page {dashboardData.pagination.page} of {dashboardData.pagination.pages}
                      {' '}
                      ({dashboardData.pagination.total} total users)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={!dashboardData.pagination.hasPrev}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!dashboardData.pagination.hasNext}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AdminEditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        isLoading={updateUser.isPending}
      />
    </div>
  );
};

export default AdminDashboard;
