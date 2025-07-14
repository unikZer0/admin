import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import {
  UserPlus,
  Search,
  Filter,
  Eye,
  Trash2,
  Package,
  Pencil,
  Box,
  PackagePlusIcon,
} from "lucide-react";
import Badge from "../ui/badge/Badge";
import { useProductTable } from "../../hooks/useProductTable";


import AddProductModal from "../Modal/productModal/AddProductModal";
import DeleteProductModal from "../Modal/productModal/DeleteProductModal";
import EditProductModal from "../Modal/productModal/EditProductModal";
import ViewProductModal from "../Modal/productModal/ViewProductModal";
import SuccessModal from "../Modal/productModal/SuccessModal"; 

const ProductTable: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const {
    filteredProducts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    showAddModal,
    isSubmitting,
    showDeleteModal,
    deleteLoading,
    deleteError,
    showEditModal,
    editProduct,
    setEditProduct,
    editLoading,
    editError,
    newProduct,
    handleEditProduct,
    handleViewProduct,
    handleDeleteProduct,
    handleAddNewProduct,
    handleCloseModal,
    handleInputChange,
    handleSubmitNewProduct,
    openDeleteModal,
    closeDeleteModal,
    openEditModal,
    closeEditModal,
    getStatusColor,
    getStatusByStock,
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
      {/* Add Product Modal */}
      <AddProductModal
        showAddModal={showAddModal}
        newProduct={newProduct}
        productTypes={productTypes}
        isSubmitting={isSubmitting}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        handleSubmitNewProduct={handleSubmitNewProduct}
      />

      {/* Delete Product Modal */}
      <DeleteProductModal
        showDeleteModal={showDeleteModal}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
        closeDeleteModal={closeDeleteModal}
        handleDeleteProduct={handleDeleteProduct}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        showEditModal={showEditModal}
        editProduct={editProduct}
        productTypes={productTypes}
        editLoading={editLoading}
        editError={editError}
        closeEditModal={closeEditModal}
        setEditProduct={setEditProduct}
        handleEditProduct={handleEditProduct}
      />

      {/* View Product Modal */}
      <ViewProductModal
        showViewModal={showViewModal}
        viewProduct={viewProduct}
        closeViewModal={closeViewModal}
        getStatusColor={getStatusColor}
        getStatusByStock={getStatusByStock}
        formatPrice={formatPrice}
      />

      {/* Success Modal */}
      <SuccessModal
        showSuccessModal={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

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
            endIcon={<PackagePlusIcon />}
            onClick={handleAddNewProduct}
            data-testid="add-product-button"
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
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left"
                  >
                    ຮູບພາບ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left"
                  >
                    ຊື່ສິນຄ້າ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left"
                  >
                    ລະຫັດ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left"
                  >
                    ແບຣນ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-left"
                  >
                    ປະເພດສິນຄ້າ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-right"
                  >
                    ລາຄາ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Box className="w-4 h-4" />
                      ສິນຄ້າຄົງຄັງ
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-center"
                  >
                    ສະຖານະ
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-6 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-center"
                  >
                    ຈັດການ
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center py-16 px-6" colSpan={9}>
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/60 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
                          ບໍ່ພົບສິນຄ້າທີ່ກົງກັບການຄົ້ນຫາຂອງທ່ານ.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product.Product_ID}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <TableCell className="px-6 py-4">
                        <img
                          src={product.Image || "/images/default-product.jpg"}
                          alt={product.Name}
                          className="w-12 h-12 object-cover rounded-md shadow-sm border border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/default-product.jpg";
                          }}
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {product.Name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300 font-mono text-sm">
                        {product.PID}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {product.Brand}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {product.productType || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right font-semibold text-green-600 dark:text-green-400">
                        {formatPrice(product.Price)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (product.totalStock || 0) > 10 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : (product.totalStock || 0) > 0
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            <Box className="w-3 h-3 mr-1" />
                            {product.totalStock || 0} ຄູ່
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        {(() => {
                          const calculatedStatus = getStatusByStock(product.totalStock);
                          console.log("ProductTable - Product:", product.Name, "totalStock:", product.totalStock, "Status:", calculatedStatus); // Debug log
                          return (
                            <Badge color={getStatusColor(calculatedStatus)}>
                              {calculatedStatus}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            size="xs"
                            variant="primary"
                            onClick={() => handleViewProduct(product.Product_ID)}
                            className="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            aria-label="View Product"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                          {(userRole === "1" || userRole === "2") && (
                            <>
                              <Button
                                size="xs"
                                variant="primary"
                                onClick={() => openEditModal(product)}
                                className="text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                                aria-label="Edit Product"
                              >
                                <Pencil className="w-5 h-5" />
                              </Button>
                              <Button
                                size="xs"
                                variant="primary"
                                onClick={() =>
                                  openDeleteModal(product.Product_ID)
                                }
                                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                                aria-label="Delete Product"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </>
                          )}
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
      {/* Total Value Section */}
      <div className="flex justify-end p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          ມູນຄ່າສິນຄ້າທັງໝົດ:{" "}
          <span className="text-green-600 dark:text-green-400">
            {formatPrice(totalValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
