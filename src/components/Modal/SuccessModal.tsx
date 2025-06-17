import React from "react";

interface SuccessModalProps {
  showSuccessModal: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  showSuccessModal,
  onClose,
}) => {
  if (!showSuccessModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          ເພີ່ມສິນຄ້າສຳເລັດ
        </h3>
        <p className="text-gray-500 dark:text-gray-300 mb-4">
          ບັນທືກຂໍ້ມູນສິນຄ້າໃໝ່ສຳເລັດແລ້ວ
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md transition"
        >
          ຕົກລົງ
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
