import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    FirstName: string;
    LastName: string;
    Email: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-8 rounded w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">User Info</h2>
        {user ? (
          <>
            <p>
              <strong>Name:</strong> {user.FirstName} {user.LastName}
            </p>
            <p>
              <strong>Email:</strong> {user.Email}
            </p>
          </>
        ) : (
          <p>No user selected.</p>
        )}
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

export default Modal;


