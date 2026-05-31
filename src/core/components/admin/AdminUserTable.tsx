import React, { useState } from 'react';
import { ChevronDown, Edit2, Trash2, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import type { AdminUser } from '../../../types/admin.types';

interface AdminUserTableProps {
  users: AdminUser[];
  isLoading?: boolean;
  onEdit?: (user: AdminUser) => void;
  onDelete?: (userId: string) => void;
  onRoleChange?: (userId: string, newRole: string) => void;
}

const getRoleBadgeColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800',
    developer: 'bg-blue-100 text-blue-800',
    editor: 'bg-green-100 text-green-800',
    user: 'bg-gray-100 text-gray-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  isLoading = false,
  onEdit,
  onDelete,
  onRoleChange,
}) => {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = () => (
    <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading users...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No users found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('username')}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
                >
                  User <SortIcon />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
                >
                  Email <SortIcon />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
                >
                  Role <SortIcon />
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <tr className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit ${getRoleBadgeColor(user.role)}`}>
                      <Shield className="w-3 h-3" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.isVerified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Verified</span>
                        </div>
                      )}
                      {!user.isActive && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Inactive</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedRow(expandedRow === user._id ? null : user._id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More actions"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedRow === user._id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === user._id && (
                  <tr className="bg-gray-50 border-b">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{user.phoneNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Customer ID</p>
                            <p className="font-medium text-gray-900">{user.customerID}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Joined</p>
                            <p className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t">
                          <select
                            onChange={(e) => onRoleChange?.(user._id, e.target.value)}
                            defaultValue={user.role}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:border-blue-500"
                          >
                            <option value="user">User</option>
                            <option value="editor">Editor</option>
                            <option value="developer">Developer</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => onDelete?.(user._id)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
