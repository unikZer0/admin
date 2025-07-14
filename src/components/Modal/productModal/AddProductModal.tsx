import React, { useState } from "react";
import { X, Package, Plus, Trash2 } from "lucide-react";
import Button from "../../ui/button/Button";
import { ProductType } from "../../../hooks/useProductTable";

interface InventoryItem {
  Size: string;
  Color: string;
  Quantity: number;
}

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
    inventory: InventoryItem[];
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
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { Size: "", Color: "", Quantity: 0 }
  ]);

  // Sync inventory to parent newProduct.inventory
  React.useEffect(() => {
    // If you want to keep inventory in parent, call a prop setter here
    // Otherwise, update newProduct.inventory directly if possible
    // Example: handleInventoryChange(inventory)
    // If not possible, you can ignore this
  }, [inventory]);

  // Reset inventory when modal closes
  React.useEffect(() => {
    if (!showAddModal) {
      setInventory([{ Size: "", Color: "", Quantity: 0 }]);
    }
  }, [showAddModal]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validInventory = inventory.filter(item => item.Size && item.Color && item.Quantity >= 0);

    // Call parent handler with inventory as argument
    handleSubmitNewProduct({
      ...e,
      inventory: validInventory
    } as any);
  };

  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-2xl flex items-center justify-center z-[2147483647] p-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-300 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              ເພີ່ມສິນຄ້າໃໝ່
            </h3>
            <button
              onClick={handleCloseModal}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ປະເພດສິນຄ້າ *
                  </label>
                  <select
                    name="productType_ID"
                    value={newProduct.productType_ID || ""}
                    onChange={e => {
                      handleInputChange({
                        ...e,
                        target: {
                          ...e.target,
                          value: e.target.value ? Number(e.target.value) : 0
                        }
                      } as any);
                    }}
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

              <div className="mt-4">
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
              
              <div className="mt-4">
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
            </div>

            {/* Inventory Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  ຂໍ້ມູນສິນຄ້າຄົງຄັງ (Inventory)
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ກຳລັງບັນທຶກ...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5 mr-2" />
                    ບັນທຶກສິນຄ້າ
                  </>
                )}
              </button>
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="px-6 py-3"
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
