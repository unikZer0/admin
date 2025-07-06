import React, { useState, useEffect } from "react";
import { X, Package, Plus, Trash2 } from "lucide-react";
import Button from "../../ui/button/Button";
import { ProductType } from "../../../hooks/useProductTable";

interface InventoryItem {
  Inventory_ID?: number;
  Size: string;
  Color: string;
  Quantity: number;
}

interface Product {
  Product_ID: number;
  PID: string;
  Name: string;
  Brand: string;
  Price: number;
  Description: string;
  Status: string;
  Image: string;
  productType_ID: number;
  Added_By: string;
  inventory?: InventoryItem[];
}

interface EditProductModalProps {
  showEditModal: boolean;
  editProduct: Product | null;
  productTypes: ProductType[];
  editLoading: boolean;
  editError: string | null;
  closeEditModal: () => void;
  setEditProduct: (product: Product | null) => void;
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
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (editProduct) {
      if (editProduct.inventory && editProduct.inventory.length > 0) {
        setInventory(editProduct.inventory);
      } else {
        setInventory([{ Size: "", Color: "", Quantity: 0 }]);
      }
    }
  }, [editProduct]);

  const addInventoryItem = () => {
    setInventory([...inventory, { Size: "", Color: "", Quantity: 0 }]);
  };

  const removeInventoryItem = (index: number) => {
    if (inventory.length > 1) {
      setInventory(inventory.filter((_, i) => i !== index));
    }
  };

  const updateInventoryItem = (index: number, field: keyof InventoryItem, value: string | number) => {
    const updatedInventory = [...inventory];
    updatedInventory[index] = { ...updatedInventory[index], [field]: value };
    setInventory(updatedInventory);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editProduct) return;
    
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: name === 'Price' ? parseFloat(value) || 0 : 
              name === 'productType_ID' ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    // Filter valid inventory items (allow Quantity = 0)
    const validInventory = inventory.filter(item => item.Size && item.Color && item.Quantity >= 0);
    console.log("EditProductModal - Valid inventory:", validInventory); // Debug log

    // Create synthetic event with inventory data
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        inventory: validInventory
      },
      preventDefault: () => {}
    };

    // Add inventory to editProduct before submitting
    const productWithInventory = {
      ...editProduct,
      inventory: validInventory
    };
    
    setEditProduct(productWithInventory);
    handleEditProduct(syntheticEvent as React.FormEvent);
  };

  // Debug log for productType_ID
  console.log("EditProductModal - editProduct:", editProduct);
  console.log("EditProductModal - productType_ID:", editProduct?.productType_ID);
  console.log("EditProductModal - productTypes:", productTypes);

  if (!showEditModal || !editProduct) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-2xl flex items-center justify-center z-[2147483647] p-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-300 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              ແກ້ໄຂສິນຄ້າ
            </h3>
            <button
              onClick={closeEditModal}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {editError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{editError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Information Section */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                ຂໍ້ມູນສິນຄ້າ
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ລະຫັດສິນຄ້າ
                  </label>
                  <input
                    type="text"
                    value={editProduct.PID}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ຊື່ສິນຄ້າ *
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={editProduct.Name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="ໃສ່ຊື່ສິນຄ້າ"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ແບຣນ *
                  </label>
                  <input
                    type="text"
                    name="Brand"
                    value={editProduct.Brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="ໃສ່ແບຣນ"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ລາຄາ (ກີບ) *
                  </label>
                  <input
                    type="number"
                    name="Price"
                    value={editProduct.Price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="10000"
                    min="10000"
                    max="99999999.99"
                    step="0.01"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ລາຄາຂັ້ນຕ່ຳ: 10,000 ກີບ | ລາຄາສູງສຸດ: 99,999,999.99 ກີບ
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ສະຖານະ
                  </label>
                  <select
                    name="Status"
                    value={editProduct.Status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="ມີຂາຍ">ມີຂາຍ</option>
                    <option value="ໝົດ">ໝົດ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ປະເພດສິນຄ້າ *
                  </label>
                  <select
                    name="productType_ID"
                    value={editProduct.productType_ID}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">-- ເລືອກປະເພດສິນຄ້າ --</option>
                    {productTypes && productTypes.length > 0 ? (
                      productTypes.map((type) => (
                        <option key={type.productType_ID} value={type.productType_ID}>
                          {type.productType_Name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>ກຳລັງໂຫຼດຂໍ້ມູນ...</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL ຮູບພາບ
                  </label>
                  <input
                    type="text"
                    name="Image"
                    value={editProduct.Image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="ໃສ່ URL ຮູບພາບ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ເພີ່ມໂດຍ
                  </label>
                  <input
                    type="text"
                    name="Added_By"
                    value={editProduct.Added_By}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="ຊື່ຜູ້ເພີ່ມ"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ລາຍລະອຽດ
                </label>
                <textarea
                  name="Description"
                  value={editProduct.Description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="ໃສ່ລາຍລະອຽດສິນຄ້າ"
                />
              </div>
            </div>

            {/* Inventory Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  ຂໍ້ມູນສິນຄ້າຄົງຄັງ (Inventory)
                </h4>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addInventoryItem();
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  ເພີ່ມຂະໜາດ/ສີ
                </Button>
              </div>

              <div className="space-y-4">
                {inventory.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        ລາຍການທີ {index + 1}
                      </h5>
                      {inventory.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeInventoryItem(index);
                          }}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ຂະໜາດ
                        </label>
                        <input
                          type="text"
                          value={item.Size}
                          onChange={(e) => updateInventoryItem(index, 'Size', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="ຂະໜາດ"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ສີ
                        </label>
                        <input
                          type="text"
                          value={item.Color}
                          onChange={(e) => updateInventoryItem(index, 'Color', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="ສີ"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ຈຳນວນ
                        </label>
                        <input
                          type="number"
                          value={item.Quantity}
                          onChange={(e) => updateInventoryItem(index, 'Quantity', parseInt(e.target.value) || 0)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg px-6 py-3 flex items-center justify-center transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ກຳລັງບັນທຶກ...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5 mr-2" />
                    ບັນທຶກການແກ້ໄຂ
                  </>
                )}
              </button>
              <Button
                type="button"
                variant="outline"
                onClick={closeEditModal}
                className="px-6 py-3"
                disabled={editLoading}
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

export default EditProductModal;
