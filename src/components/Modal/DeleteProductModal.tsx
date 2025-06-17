import React from "react";
import { Trash2 } from "lucide-react";

interface DeleteProductModalProps {
  showDeleteModal: boolean;
  deleteLoading: boolean;
  deleteError: string | null;
  closeDeleteModal: () => void;
  handleDeleteProduct: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  showDeleteModal,
  deleteLoading,
  deleteError,
  closeDeleteModal,
  handleDeleteProduct,
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[2147483647] flex items-center justify-center bg-black/40 backdrop-blur-2xl">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800 animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            ຢຶນຢັນການລົບສິນຄ້າ
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            ເຈົ້າແນ່ໃຈແລ້ວບໍ່ວ່າຕ້ອງການລົບ{" "}
            <span className="text-red-600 font-semibold">ສິນຄ້າ</span>?
          </p>
          {deleteError && (
            <div className="text-red-500 mb-2">{deleteError}</div>
          )}
          <div className="flex w-full gap-3 mt-2">
            <button
              onClick={closeDeleteModal}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              disabled={deleteLoading}
            >
              ຍົກເລີກ
            </button>
            <button
              onClick={handleDeleteProduct}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-md transition disabled:opacity-60"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  ກຳລັງລົບ...
                </span>
              ) : (
                "ລົບ"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
