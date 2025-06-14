import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { UserPlus, Edit, Search, Filter, Eye, Trash2, Package, X, Upload, Pencil } from "lucide-react";
import Badge from "../ui/badge/Badge";
import { useProductTable } from "../../hooks/useProductTable";

// Product interface based on your API response
interface Product {
  Product_ID: number;
  PID: string;
  Name: string;
  Brand: string;
  Price: string;
  Description: string;
  Status: string;
  Image: string;
  ProductType_ID: number;
  Shop_ID: number | null;
  Added_By: string;
  productType?: string;
}

// New product form data interface
interface NewProductData {
  Name: string;
  Brand: string;
  Price: string;
  Description: string;
  Status: string;
  Image: string;
  productType_ID: number;
  Added_By: string;
}


const ProductTable: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    products, filteredProducts, loading, error,
    searchTerm, setSearchTerm,
    selectedStatus, setSelectedStatus,
    showAddModal, setShowAddModal,
    isSubmitting, setIsSubmitting,
    showDeleteModal, setShowDeleteModal,
    deletingProductId, setDeletingProductId,
    deleteLoading, setDeleteLoading,
    deleteError, setDeleteError,
    showEditModal, setShowEditModal,
    editProduct, setEditProduct,
    editLoading, setEditLoading,
    editError, setEditError,
    newProduct, setNewProduct,
    handleEditProduct,
    handleViewProduct,
    handleDeleteProduct,
    handleAddNewProduct,
    handleCloseModal,
    handleInputChange,
    handleSubmitNewProduct,
    fetchProducts,
    openDeleteModal,
    closeDeleteModal,
    openEditModal,
    closeEditModal,
    getStatusColor,
    formatPrice,
    uniqueStatuses,
    totalValue,
    userRole,
    viewProduct,
    showViewModal,
    closeViewModal,
    productTypes,
  } = useProductTable({
    onAddSuccess: () => setShowSuccessModal(true),
  });

  // Authorization check
  if (userRole !== "1" && userRole !== "2") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ບໍ່ມີສິດເຂົ້າເຖິງ
          </h3>
          <p className="text-gray-500 dark:text-gray-300">
            ທ່ານບໍ່ມີສິດໃນການເບິ່ງໜ້ານີ້
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-300">
            ກຳລັງໂຫລດຂໍ້ມູນສິນຄ້າ...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ເກີດຂໍ້ຜິດພາດ
          </h3>
          <p className="text-red-500 text-center max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 phetsarath-font">
      {showAddModal && (
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
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 w-screen h-screen z-[2147483647] flex items-center justify-center bg-black/40 backdrop-blur-2xl">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-800 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ຢຶນຢັນການລົບສິນຄ້າ</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                ເຈົ້າແນ່ໃຈແລ້ວບໍ່ວ່າຕ້ອງການລົບ <span className="text-red-600 font-semibold">ສິນຄ້າ</span>?
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
      )}
      {showEditModal && editProduct && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-2xl flex items-center justify-center z-[2147483647] p-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ແກ້ໄຂສິນຄ້າ</h3>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ຊື່ສິນຄ້າ *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                    value={editProduct.Name}
                    onChange={e => setEditProduct({ ...editProduct, Name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ແບຣນ *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                    value={editProduct.Brand}
                    onChange={e => setEditProduct({ ...editProduct, Brand: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ລາຄາ *</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                    value={editProduct.Price}
                    onChange={e => setEditProduct({ ...editProduct, Price: e.target.value })}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ສະຖານະ</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                    value={editProduct.Status}
                    onChange={e => setEditProduct({ ...editProduct, Status: e.target.value })}
                  >
                    <option value="ມີຂາຍ">ມີຂາຍ</option>
                    <option value="ໝົດ">ໝົດ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ประเภทสินค้า</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                    value={editProduct.ProductType_ID}
                    onChange={e => setEditProduct({ ...editProduct, ProductType_ID: Number(e.target.value) })}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL ຮູບພາບ</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                    value={editProduct.Image}
                    onChange={e => setEditProduct({ ...editProduct, Image: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ລາຍລະອຽດ</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                  value={editProduct.Description}
                  onChange={e => setEditProduct({ ...editProduct, Description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ເພີ່ມໂດຍ</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                  value={editProduct.Added_By}
                  onChange={e => setEditProduct({ ...editProduct, Added_By: e.target.value })}
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
      )}
      {showViewModal && viewProduct && (
        <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-0 overflow-hidden border border-gray-100 dark:border-gray-800 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{viewProduct.Name}</h3>
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
                onError={e => { (e.target as HTMLImageElement).src = "/images/default-product.jpg"; }}
              />
            </div>
            {/* Details */}
            <div className="px-6 py-5 space-y-3 bg-gray-100 dark:bg-gray-800">
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">ລະຫັດສິນຄ້າ</span>
                  <span className="font-mono text-base text-gray-700 dark:text-gray-200">{viewProduct.PID}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">ແບຣນ</span>
                  <span className="font-medium text-base text-gray-700 dark:text-gray-200">{viewProduct.Brand}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">ລາຄາ</span>
                  <span className="font-semibold text-lg text-green-600 dark:text-green-400">₭{formatPrice(viewProduct.Price)}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">ສະຖານະ</span>
                  <Badge size="sm" color={getStatusColor(viewProduct.Status)}>
                    {viewProduct.Status}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">ລາຍລະອຽດ</span>
                <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{viewProduct.Description || "-"}</p>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">ປະເພດສິນຄ້າ</span>
                  <span className="text-gray-700 dark:text-gray-200">{viewProduct.productType || viewProduct.ProductType_ID}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">ເພີ່ມໂດຍ</span>
                  <span className="text-gray-700 dark:text-gray-200">{viewProduct.Added_By}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">ເພີ່ມສິນຄ້າສຳເລັດ</h3>
            <p className="text-gray-500 dark:text-gray-300 mb-4">ບັນທືກຂໍ້ມູນສິນຄ້າໃໝ່ສຳເລັດແລ້ວ</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-md transition"
            >
              ຕົກລົງ
            </button>
          </div>
        </div>
      )}
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              ຈັດການສິນຄ້າ
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              ລາຍການສິນຄ້າທັງໝົດ {filteredProducts.length} ລາຍການ
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            endIcon={<UserPlus />}
            onClick={handleAddNewProduct}
            className="shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            ເພີ່ມສິນຄ້າໃໝ່
          </Button>
        </div>
      </div>
      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-colors duration-300">

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="ຄົ້ນຫາສິນຄ້າ, ແບຣນ, ຫຼືລະຫັດສິນຄ້າ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 dark:text-gray-500 w-5 h-5" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            >
              <option value="all">ສະຖານະທັງໝົດ</option>
              {uniqueStatuses.map((status: string, index: number) => (
                <option key={`${status}-${index}`} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/70 dark:to-gray-800/70 border-b border-gray-200 dark:border-gray-600">
                  <TableCell isHeader className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left">
                    ຮູບພາບ
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left">
                    ຊື່ສິນຄ້າ
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left">
                    ລະຫັດ
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left">
                    ແບຣນ
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left">
                    ປະເພດສິນຄ້າ
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-right">
                    ລາຄາ
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-center">
                    ສະຖານະ
                  </TableCell>
                  <TableCell isHeader className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-center">
                    ຈັດການ
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <td colSpan={7} className="text-center py-16 px-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/60 rounded-full flex items-center justify-center mb-4">
                          <Package className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          ບໍ່ພົບສິນຄ້າ
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
                          {searchTerm || selectedStatus !== "all"
                            ? "ບໍ່ພົບສິນຄ້າທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ. ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ໂຕກອງເບິ່ງ."
                            : "ຍັງບໍ່ມີສິນຄ້າໃນລະບົບ. ເລີ່ມຕົ້ນດ້ວຍການເພີ່ມສິນຄ້າທຳອິດ."}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: Product, index: number) => (
                    <TableRow
                      key={`product-${product.Product_ID}-${index}`}
                      className={`
                      align-middle transition-colors duration-150 ease-in-out
                      border-b border-gray-100 dark:border-gray-700 last:border-b-0
                      ${index % 2 === 1 ? 'bg-gray-50/70 dark:bg-gray-700/30' : 'bg-white dark:bg-gray-800'}
                      hover:bg-blue-50/80 dark:hover:bg-blue-900/30
                    `}
                    >
                      <TableCell className="px-6 py-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex-shrink-0">
                          <img
                            src={product.Image || "/images/default-product.jpg"}
                            alt={product.Name || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/default-product.jpg";
                            }}
                            loading="lazy"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 max-w-xs">
                        <div className="space-y-0.5">
                          <h4 className="font-medium text-gray-900 dark:text-white leading-tight">
                            {product.Name || "ບໍ່ມີຊື່"}
                          </h4>
                          {product.Description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                              {product.Description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/80 px-2 py-1 rounded">
                          {product.PID || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {product.Brand || "ບໍ່ມີແບຣນ"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {product.productType || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                          ₭{formatPrice(product.Price)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Badge
                          size="sm"
                          color={getStatusColor(product.Status)}
                        >
                          {product.Status || "ບໍ່ມີສະຖານະ"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewProduct(product.Product_ID)}
                            className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-all duration-150"
                            title="ເບິ່ງລາຍລະອຽດ"
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-100 dark:hover:bg-green-700/40 rounded-md transition-all duration-150"
                            title="ແກ້ໄຂ"
                            type="button"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(product.Product_ID)}
                            className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-all duration-150"
                            title="ลบ"
                            type="button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {/* Footer Stats */}
      {filteredProducts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
          {filteredProducts.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-6">
                  <span>
                    ສະແດງ {filteredProducts.length} ລາຍການ ຈາກທັງໝົດ {products.length} ລາຍການ
                  </span>
                  <span>
                    ມູນຄ່າລວມ (ທີ່ສະແດງ): {" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ₭{totalValue.toLocaleString('lo-LA', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </span>
                  </span>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  ຂໍ້ມູນອັບເດດຫຼ້າສຸດ: {" "}
                  {new Date().toLocaleDateString('lo-LA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTable;