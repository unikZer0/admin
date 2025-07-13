import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
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
  };
}

const UsersModal: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Role_id: 3,
    Sex: "Male",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        Phone: user.Phone,
        Role_id: user.Role_id,
        Sex: user.Sex,
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:3000/api/admin/update/${user.User_ID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onClose();
      setTimeout(() => {
        location.reload();
      }, 0);
    } catch (err) {
      Swal.fire(
        'Error!',
        'Failed to update user',
        'error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-8 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          <select
            name="Role_id"
            value={formData.Role_id}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          >
            <option value={1}>Admin</option>
            <option value={2}>Manager</option>
            <option value={3}>Customer</option>
          </select>
          <select
            name="Sex"
            value={formData.Sex}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <div className="flex justify-between gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.18s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
};

export default UsersModal;
