import React from "react";
import { X, Package } from "lucide-react";
import Badge from "../ui/badge/Badge"; 
import { Product } from "../../hooks/useProductTable"; 

interface ViewProductModalProps {
  showViewModal: boolean;
  viewProduct: Product | null;
  closeViewModal: () => void;
  getStatusColor: (status: string) => string;
  formatPrice: (price: string) => string; 
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  showViewModal,
  viewProduct,
  closeViewModal,
  formatPrice,
}) => {
  if (!showViewModal || !viewProduct) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-0 overflow-hidden border border-gray-100 dark:border-gray-800 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {viewProduct.Name}
            </h3>
          </div>
          <button
            onClick={closeViewModal}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Image */}
        <div className="w-full h-56 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          <img
            src={viewProduct.Image || "/images/default-product.jpg"}
            alt={viewProduct.Name}
            className="object-contain h-full max-w-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/default-product.jpg";
            }}
          />
        </div>
        {/* Details */}
        <div className="px-6 py-5 space-y-3 bg-gray-100 dark:bg-gray-800">
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                ລະຫັດສິນຄ້າ
              </span>
              <span className="font-mono text-base text-gray-700 dark:text-gray-200">
                {viewProduct.PID}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                ແບຣນ
              </span>
              <span className="font-medium text-base text-gray-700 dark:text-gray-200">
                {viewProduct.Brand}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                ລາຄາ
              </span>
              <span className="font-semibold text-lg text-green-600 dark:text-green-400">
                ₭{formatPrice(viewProduct.Price)}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                ສະຖານະ
              </span>
              <Badge size="sm">
                {viewProduct.Status}
              </Badge>
            </div>
          </div>
          <div>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              ລາຍລະອຽດ
            </span>
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
              {viewProduct.Description || "-"}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                ປະເພດສິນຄ້າ
              </span>
              <span className="text-gray-700 dark:text-gray-200">
                {viewProduct.productType || viewProduct.ProductType_ID}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                ເພີ່ມໂດຍ
              </span>
              <span className="text-gray-700 dark:text-gray-200">
                {viewProduct.Added_By}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
