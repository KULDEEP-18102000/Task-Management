import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';
import { USER_ROLES, USER_ROLE_LABELS } from '../utils/constants';
import { formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Users, Shield, Mail, Calendar } from 'lucide-react';
import ConfirmModal from '../components/common/ConfirmModal';

import { useAuth } from '../hooks/useAuth';

const UsersPage = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();
  
  // Modal state
  const [confirmModal, setConfirmModal] = React.useState({
    isOpen: false,
    user: null,
    newRole: null
  });

  // Fetch users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['users-management'],
    queryFn: () => userService.getAllUsersForManagement(),
  });

  // Change role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => userService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['users-management']);
      toast.success('User role updated successfully');
      setConfirmModal({ isOpen: false, user: null, newRole: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    },
  });

  const handleRoleChange = (user, newRole) => {
    setConfirmModal({
      isOpen: true,
      user,
      newRole
    });
  };

  const confirmRoleChange = () => {
    if (confirmModal.user && confirmModal.newRole) {
      updateRoleMutation.mutate({ 
        id: confirmModal.user.id, 
        role: confirmModal.newRole 
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-primary-600" />
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user roles and permissions across the platform.
            </p>
          </div>
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium border border-primary-100">
            Total Users: {users.length}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100">
            Failed to load users. Please try again later.
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user.fullName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.fullName}
                            {user.id === currentUser?.id && (
                              <span className="ml-2 text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {formatDateTime(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Shield size={16} className={user.role === USER_ROLES.ADMIN ? 'text-red-500' : 'text-primary-500'} />
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user, e.target.value)}
                            disabled={
                              updateRoleMutation.isPending || 
                              user.email === 'admin@taskmanager.com' || 
                              user.id === currentUser?.id
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 cursor-pointer disabled:opacity-50"
                          >
                            {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmRoleChange}
        title="Change User Role"
        message={`Are you sure you want to change ${confirmModal.user?.fullName}'s role to ${USER_ROLE_LABELS[confirmModal.newRole]}?`}
        confirmText="Change Role"
        variant="warning"
        loading={updateRoleMutation.isPending}
      />
    </Layout>
  );
};

export default UsersPage;
