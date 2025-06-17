import React,{ useState, useEffect } from "react";

import axios from "axios";

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
      const data = await axios.post(`http://localhost:3000/api/admin/update/${user.User_ID}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(data);
      
      setTimeout(() => {
  location.reload();
},0);

      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-8 rounded w-96 text-center"  onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="Phone"
            value={formData.Phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-2 rounded"
          />
          {user?.Role_id === 1 ||(
            <select
            name="Role_id"
            value={formData.Role_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={1}>Admin</option>
            <option value={2}>Manager</option>
            <option value={3}>Customer</option>
          </select>
          )}
          <select
            name="Sex"
            value={formData.Sex}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
        <button
          className="mt-4 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={onClose}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default UsersModal;
