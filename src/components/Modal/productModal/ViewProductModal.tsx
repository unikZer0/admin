import React from "react";
import { X, Package, Tag, DollarSign, FileText, Image as ImageIcon, Box, Palette, Hash } from "lucide-react";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";

interface InventoryItem {
  Inventory_ID: number;
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
  productType: string;
  Added_By: string;
  totalStock?: number;
  inventory?: InventoryItem[];
}

interface ViewProductModalProps {
  showViewModal: boolean;
  viewProduct: Product | null;
  closeViewModal: () => void;
  getStatusColor: (status: string) => string;
  getStatusByStock: (totalStock: number) => string;
  formatPrice: (price: number) => string;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  showViewModal,
  viewProduct,
  closeViewModal,
  getStatusColor,
  getStatusByStock,
  formatPrice,
}) => {
  if (!showViewModal || !viewProduct) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-2xl flex items-center justify-center z-[2147483647] p-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-300 dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              ລາຍລະອຽດສິນຄ້າ
            </h3>
            <button
              onClick={closeViewModal}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Product Image */}
            {viewProduct.Image && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  ຮູບພາບສິນຄ້າ
                </h4>
                <div className="flex justify-center">
                  <img
                    src={viewProduct.Image}
                    alt={viewProduct.Name}
                    className="max-w-full h-64 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Product Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                ຂໍ້ມູນສິນຄ້າ
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ລະຫັດສິນຄ້າ
                    </label>
                    <p className="text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-600 px-3 py-2 rounded-lg">
                      {viewProduct.PID}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ຊື່ສິນຄ້າ
                    </label>
                    <p className="text-gray-900 dark:text-white font-semibold text-lg">
                      {viewProduct.Name}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ແບຣນ
                    </label>
                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-600" />
                      {viewProduct.Brand}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ລາຄາ
                    </label>
                    <p className="text-green-600 dark:text-green-400 font-bold text-xl flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      {formatPrice(viewProduct.Price)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ປະເພດສິນຄ້າ
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {viewProduct.productType}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ສະຖານະ
                    </label>
                    <Badge
                      color={getStatusColor(getStatusByStock(viewProduct.totalStock))}
                      className="text-sm"
                    >
                      {getStatusByStock(viewProduct.totalStock)}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ສິນຄ້າຄົງຄັງທັງໝົດ
                    </label>
                    <p className="text-gray-900 dark:text-white font-semibold text-lg flex items-center gap-2">
                      <Box className="w-5 h-5 text-blue-600" />
                      {viewProduct.totalStock || 0} ຄູ່
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      ເພີ່ມໂດຍ
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {viewProduct.Added_By || 'ບໍ່ລະບຸ'}
                    </p>
                  </div>
                </div>
              </div>
              
              {viewProduct.Description && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    ລາຍລະອຽດ
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <p className="text-gray-900 dark:text-white flex items-start gap-2">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      {viewProduct.Description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Inventory Details */}
            {viewProduct.inventory && viewProduct.inventory.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Box className="w-5 h-5 text-blue-600" />
                  ລາຍລະອຽດສິນຄ້າຄົງຄັງ
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            ລະຫັດ
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            ຂະໜາດ
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            ສີ
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <Box className="w-4 h-4" />
                            ຈຳນວນ
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewProduct.inventory.map((item, index) => (
                        <tr key={item.Inventory_ID} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-mono">
                            {item.Inventory_ID}
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {item.Size}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                              {item.Color}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {item.Quantity} ຄູ່
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    ສິນຄ້າຄົງຄັງທັງໝົດ: <span className="font-bold">{viewProduct.totalStock || 0} ຄູ່</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-6">
            <Button
              variant="outline"
              onClick={closeViewModal}
              className="px-6 py-3"
            >
              ປິດ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
