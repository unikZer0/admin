import React, { useEffect, useState } from 'react';
import UsersModal from '../Modal/userModal/UsersModal';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
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
      setUsers(res.data.data || res.data.users || res.data); // Adjust if API shape is different
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

  return (
    <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin mr-2" /> Loading...
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left rounded-tl-lg">Avatar</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user.User_ID}
                className={
                  idx % 2 === 0
                    ? 'bg-white hover:bg-gray-50 transition'
                    : 'bg-gray-50 hover:bg-gray-100 transition'
                }
              >
                <td className="px-4 py-2">
                  <img
                    src={user.Image || '/default-avatar.png'}
                    alt={user.FirstName}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td className="px-4 py-2 font-medium">{user.FirstName} {user.LastName}</td>
                <td className="px-4 py-2">{user.Email}</td>
                <td className="px-4 py-2 capitalize">
                  {user.Role_id === 1 ? 'Admin' : user.Role_id === 2 ? 'Manager' : 'Customer'}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition"
                      onClick={() => openModal(user)}
                      aria-label="Edit user"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                      onClick={() => handleDelete(user.User_ID, `${user.FirstName} ${user.LastName}`)}
                      disabled={deleting === user.User_ID}
                      aria-label="Delete user"
                    >
                      {deleting === user.User_ID ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <UsersModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser ?? undefined}
      />
    </div>
  );
};

export default UserTable;
