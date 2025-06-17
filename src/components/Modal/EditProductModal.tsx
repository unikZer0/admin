import React from "react";
import { Product, ProductType } from "../../hooks/useProductTable"; 

interface EditProductModalProps {
  showEditModal: boolean;
  editProduct: Product | null;
  productTypes: ProductType[]; 
  editLoading: boolean;
  editError: string | null;
  closeEditModal: () => void;
  setEditProduct: (product: Product) => void;
  handleEditProduct: (e: React.FormEvent) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  showEditModal,
  editProduct,
  productTypes,
  editLoading,
  editError,
  closeEditModal,
  setEditProduct,
  handleEditProduct,
}) => {
  if (!showEditModal || !editProduct) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-2xl flex items-center justify-center z-[2147483647] p-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          ແກ້ໄຂສິນຄ້າ
        </h3>
        <form onSubmit={handleEditProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ຊື່ສິນຄ້າ *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                value={editProduct.Name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, Name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ແບຣນ *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                value={editProduct.Brand}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, Brand: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ລາຄາ *
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                value={editProduct.Price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, Price: e.target.value })
                }
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ສະຖານະ
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                value={editProduct.Status}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, Status: e.target.value })
                }
              >
                <option value="ມີຂາຍ">ມີຂາຍ</option>
                <option value="ໝົດ">ໝົດ</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ປະເພດສິນຄ້າ
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                value={editProduct.ProductType_ID}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    ProductType_ID: Number(e.target.value),
                  })
                }
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL ຮູບພາບ
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                value={editProduct.Image}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, Image: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ລາຍລະອຽດ
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
              value={editProduct.Description}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  Description: e.target.value,
                })
              }
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ເພີ່ມໂດຍ
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
              value={editProduct.Added_By}
              onChange={(e) =>
                setEditProduct({ ...editProduct, Added_By: e.target.value })
              }
            />
          </div>
          {editError && <div className="text-red-500">{editError}</div>}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={closeEditModal}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              disabled={editLoading}
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md transition disabled:opacity-60"
              disabled={editLoading}
            >
              {editLoading ? "ກຳລັງບັນທືກ..." : "ບັນທຶກ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
