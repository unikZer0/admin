import React from "react";
import { X, Package } from "lucide-react";
import Button from "../ui/button/Button"; // Assuming Button component path
import { ProductType } from "../../hooks/useProductTable"; // Assuming ProductType interface from your hook

interface AddProductModalProps {
  showAddModal: boolean;
  newProduct: {
    Name: string;
    Brand: string;
    Price: string;
    Description: string;
    Status: string;
    Image: string;
    productType_ID: number;
    Added_By: string;
  };
  productTypes: ProductType[]; 
  isSubmitting: boolean;
  handleCloseModal: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmitNewProduct: (e: React.FormEvent) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  showAddModal,
  newProduct,
  productTypes,
  isSubmitting,
  handleCloseModal,
  handleInputChange,
  handleSubmitNewProduct,
}) => {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-2xl flex items-center justify-center z-[2147483647] p-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-300 dark:border-gray-700">
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              ເພີ່ມສິນຄ້າໃໝ່
            </h3>
            <button
              onClick={handleCloseModal}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitNewProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ຊື່ສິນຄ້າ *
                </label>
                <input
                  type="text"
                  name="Name"
                  value={newProduct.Name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="ໃສ່ຊື່ສິນຄ້າ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ແບຣນ *
                </label>
                <input
                  type="text"
                  name="Brand"
                  value={newProduct.Brand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="ໃສ່ແບຣນ"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ລາຄາ (ກີບ) *
                </label>
                <input
                  type="number"
                  name="Price"
                  value={newProduct.Price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ສະຖານະ
                </label>
                <select
                  name="Status"
                  value={newProduct.Status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="ມີຂາຍ">ມີຂາຍ</option>
                  <option value="ໝົດ">ໝົດ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ປະເພດສິນຄ້າ
                </label>
                <select
                  name="productType_ID"
                  value={newProduct.productType_ID}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">-- ເລືອກປະເພດສິນຄ້າ --</option>
                  {productTypes.map((type) => (
                    <option key={type.productType_ID} value={type.productType_ID}>
                      {type.productType_Name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL ຮູບພາບ
                </label>
                <input
                  type="text"
                  name="Image"
                  value={newProduct.Image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="ໃສ່ URL ຮູບພາບ"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ລາຍລະອຽດ
              </label>
              <textarea
                name="Description"
                value={newProduct.Description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="ໃສ່ລາຍລະອຽດສິນຄ້າ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ເພີ່ມໂດຍ
              </label>
              <input
                type="text"
                name="Added_By"
                value={newProduct.Added_By}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="ຊື່ຜູ້ເພີ່ມ"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg px-4 py-2 flex items-center justify-center transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ກຳລັງບັນທຶກ...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    ບັນທຶກສິນຄ້າ
                  </>
                )}
              </button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                ຍົກເລີກ
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
