import React, { useEffect, useState } from 'react';
import UsersModal from '../Modal/userModal/UsersModal';
import { Loader2, Pencil, Trash2, Users, Shield, Crown } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

// User type based on UsersModal
interface User {
  User_ID: number;
  UID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Role_id: number;
  Sex: string;
  Image?: string;
  Registration_Date: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:3000/api/admin/getusers/',{},
        {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          
      });
      // Filter out customers (Role_id === 3)
      const filteredUsers = (res.data.data || res.data.users || res.data).filter((user: User) => user.Role_id !== 3);
      setUsers(filteredUsers);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open modal for editing
  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    // After closing modal, reload users (in case of update)
    fetchUsers();
  };

  // Handle user deletion
  const handleDelete = async (userId: number, userName: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${userName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return;
    }

    setDeleting(userId);
    try {
      await axios.post(`http://localhost:3000/api/admin/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Remove user from state
      setUsers(users.filter(user => user.User_ID !== userId));
      
      // Show success message
      Swal.fire(
        'Deleted!',
        `${userName} has been deleted successfully.`,
        'success'
      );
    } catch (err: any) {
      Swal.fire(
        'Error!',
        err.response?.data?.message || 'Failed to delete user',
        'error'
      );
    } finally {
      setDeleting(null);
    }
  };

  // Get role info with styling
  const getRoleInfo = (roleId: number) => {
    switch (roleId) {
      case 1:
        return {
          name: 'Admin',
          icon: <Crown className="w-4 h-4" />,
          bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
          textColor: 'text-white',
          borderColor: 'border-purple-200'
        };
      case 2:
        return {
          name: 'Manager',
          icon: <Shield className="w-4 h-4" />,
          bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          textColor: 'text-white',
          borderColor: 'border-blue-200'
        };
      case 4:
        return {
          name: 'Staff',
          icon: <Shield className="w-4 h-4" />,
          bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          textColor: 'text-white',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          name: 'User',
          icon: <Users className="w-4 h-4" />,
          bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
          textColor: 'text-white',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Get user stats
  const getStats = () => {
    const adminCount = users.filter(user => user.Role_id === 1).length;
    const managerCount = users.filter(user => user.Role_id === 2).length;
    const staffCount = users.filter(user => user.Role_id === 4).length;
    const totalUsers = users.length;

    return { adminCount, managerCount, staffCount, totalUsers };
  };

  const stats = getStats();

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600">Manage your team members and administrators</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Staff</p>
                <p className="text-2xl font-bold text-purple-900">{stats.totalUsers}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Managers</p>
                <p className="text-2xl font-bold text-blue-900">{stats.managerCount}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Staff</p>
                <p className="text-2xl font-bold text-green-900">{stats.staffCount}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
              <span className="text-gray-600 font-medium">Loading staff members...</span>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, idx) => {
                  const roleInfo = getRoleInfo(user.Role_id);
                  return (
                    <tr
                      key={user.User_ID}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={user.Image || '/default-avatar.png'}
                              alt={`${user.FirstName} ${user.LastName}`}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${roleInfo.bgColor} rounded-full border-2 border-white flex items-center justify-center`}>
                              {roleInfo.icon}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {user.FirstName} {user.LastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Joined {new Date(user.Registration_Date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                          {user.UID}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">{user.Email}</p>
                          <p className="text-xs text-gray-500">{user.Phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.textColor} shadow-sm`}>
                          <span className="mr-1">{roleInfo.icon}</span>
                          {roleInfo.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors duration-200 group"
                            onClick={() => openModal(user)}
                            aria-label="Edit user"
                          >
                            <Pencil size={16} className="group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200 group"
                            onClick={() => handleDelete(user.User_ID, `${user.FirstName} ${user.LastName}`)}
                            disabled={deleting === user.User_ID}
                            aria-label="Delete user"
                          >
                            {deleting === user.User_ID ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No staff members found</p>
                <p className="text-sm text-gray-400">Staff members will appear here once added</p>
              </div>
            )}
          </div>
        )}
      </div>

      <UsersModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser ?? undefined}
      />
    </div>
  );
};

export default UserTable;
