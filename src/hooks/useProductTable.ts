import { useState, useEffect } from "react";
import axios from "axios";
// ... import interface Product, NewProductData

// Product interface based on your API response
export interface Product {
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
  productType?: string; // ชื่อประเภทสินค้า (จาก join backend)
}

// New product form data interface
export interface NewProductData {
  Name: string;
  Brand: string;
  Price: string;
  Description: string;
  Status: string;
  Image: string;
  productType_ID: number;
  Added_By: string;
}

// ประเภทสินค้า
export interface ProductType {
  productType_ID: number;
  productType_Name: string;
}

interface UseProductTableOptions {
  onAddSuccess?: () => void;
}

export function useProductTable(options: UseProductTableOptions = {}) {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  // Safe localStorage access with fallback
  const getUserRole = (): string | null => {
    try {
      return localStorage.getItem("role");
    } catch (error) {
      console.warn("LocalStorage not available:", error);
      return null;
    }
  };

  const getToken = (): string | null => {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.warn("LocalStorage not available:", error);
      return null;
    }
  };

  const getUserId = (): string | null => {
    try {
      return localStorage.getItem("userId") || localStorage.getItem("username") || "Admin";
    } catch (error) {
      console.warn("LocalStorage not available:", error);
      return "Admin";
    }
  };

  // New product form state
  const [newProduct, setNewProduct] = useState<NewProductData>({
    Name: "",
    Brand: "",
    Price: "",
    Description: "",
    Status: "ມີຂາຍ",
    Image: "",
    productType_ID: 0, // แก้จาก "" เป็น 0
    Added_By: getUserId() || "Admin"
  });

  const userRole = getUserRole();

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    // Validate
    if (!editProduct.Name.trim()) {
      setEditError("ກະລຸນາໃສ່ຊື່ສິນຄ້າ");
      return;
    }
    if (!editProduct.Brand.trim()) {
      setEditError("ກະລຸນາໃສ່ແບຣນ");
      return;
    }
    if (!editProduct.Price || isNaN(Number(editProduct.Price))) {
      setEditError("ກະລຸນາໃສ່ລາຄາທີ່ຖືກຕ້ອງ");
      return;
    }
    setEditLoading(true);
    setEditError("");
    try {
      const token = getToken();
      console.log("Token:", token);
      if (!token) {
        setEditError("ไม่พบ Token");
        setEditLoading(false);
        return;
      }
      await axios.put(
        `http://localhost:3000/api/admin/products/${editProduct.Product_ID}`,
        {
          Name: editProduct.Name,
          Brand: editProduct.Brand,
          Price: Number(editProduct.Price),
          Description: editProduct.Description,
          Status: editProduct.Status,
          Image: editProduct.Image,
          productType_ID: editProduct.ProductType_ID,
          Added_By: editProduct.Added_By,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      closeEditModal();
      fetchProducts();
    } catch (error) {
      setEditError("ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂສິນຄ້າ");
    } finally {
      setEditLoading(false);
    }
  };

  const openViewModal = (product: Product) => {
    setViewProduct(product);
    setShowViewModal(true);
  };
  const closeViewModal = () => {
    setViewProduct(null);
    setShowViewModal(false);
  };

  const handleViewProduct = (productId: number) => {
    const product = products.find((p) => p.Product_ID === productId);
    if (product) {
      openViewModal(product);
    }
  };

  // Function to handle product deletion
  const handleDeleteProduct = async () => {
    if (!deletingProductId) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const token = getToken();
      if (!token) {
        setDeleteError("ບໍ່ພົບ Token");
        setDeleteLoading(false);
        return;
      }
      await axios.delete(`http://localhost:3000/api/admin/products/${deletingProductId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      closeDeleteModal();
      fetchProducts();
    } catch (error) {
      setDeleteError("ເກີດຂໍ້ຜິດພາດໃນການລຶບສິນຄ້າ");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddNewProduct = () => {
    setNewProduct({
      Name: "",
      Brand: "",
      Price: "",
      Description: "",
      Status: "ມີຂາຍ",
      Image: "",
      productType_ID: 0, // แก้จาก "" เป็น 0
      Added_By: getUserId() || "Admin"
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewProduct({
      Name: "",
      Brand: "",
      Price: "",
      Description: "",
      Status: "ມີຂາຍ",
      Image: "",
      productType_ID: 0, // แก้จาก "" เป็น 0
      Added_By: getUserId() || "Admin"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'productType_ID' ? Number(value) : value // แปลงเป็น number เสมอ
    }));
  };

  const handleSubmitNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!newProduct.Name.trim()) {
      alert("ກະລຸນາໃສ່ຊື່ສິນຄ້າ");
      return;
    }

    if (!newProduct.Brand.trim()) {
      alert("ກະລຸນາໃສ່ແບຣນ");
      return;
    }

    if (!newProduct.Price.trim() || isNaN(parseFloat(newProduct.Price))) {
      alert("ກະລຸນາໃສ່ລາຄາທີ່ຖືກຕ້ອງ");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();
      console.log("Token:", token);
      if (!token) {
        alert("ບໍ່ພົບ Authentication token");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/admin/products/create",
        newProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        if (options.onAddSuccess) {
          options.onAddSuccess();
        }
        handleCloseModal();
        // Refresh the product list
        fetchProducts();
      }
    } catch (error) {
      console.error("Error creating product:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`ເກີດຂໍ້ຜິດພາດ: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          alert("ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີເວີໄດ້");
        } else {
          alert("ເກີດຂໍ້ຜິດພາດໃນການສົ່ງຂໍ້ມູນ");
        }
      } else {
        alert("ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:3000/api/admin/products",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }

    } catch (error) {
      console.error("Error fetching products:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(
            `Failed to load products: ${error.response.status} - ${error.response.statusText}`
          );
        } else if (error.request) {
          setError("Network error: Unable to connect to server");
        } else {
          setError("Request configuration error");
        }
      } else {
        setError("An unexpected error occurred while fetching products");
      }
    } finally {
      setLoading(false);
    }
  };

  // ดึงประเภทสินค้าทั้งหมด
  const fetchProductTypes = async () => {
    try {
      const token = getToken();
      console.log("Token:", token);
      if (!token) return;
      const res = await axios.get("http://localhost:3000/api/admin/product-types", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && Array.isArray(res.data.data)) {
        setProductTypes(res.data.data);
      }
    } catch (e) {
      // ไม่ต้องแจ้ง error
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  // Filter effect
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products]; // Create a copy to avoid mutations

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.Name?.toLowerCase().includes(searchLower) ||
          product.Brand?.toLowerCase().includes(searchLower) ||
          product.PID?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((product) => product.Status === selectedStatus);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedStatus, products]);

  // Status color
  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "primary" => {
    if (!status) return "primary";

    const lowerStatus = status.toLowerCase().trim();
    switch (lowerStatus) {
      case "ใช้งาน":
      case "active":
      case "ເຄື່ອນໄຫວ":
      case "ມີ":
      case "ມີສິນຄ້າ":
      case "ພ້ອມຂາຍ":
      case "ມີຂາຍ":
        return "success";
      case "pending":
      case "รอดำเนินการ":
      case "ລໍດຳເນີນການ":
        return "warning";
      case "inactive":
      case "ไม่ใช้งาน":
      case "ສິ້ນສຸດ":
      case "ບໍ່ເຄື່ອນໄຫວ":
      case "ຢຸດໃຊ້ງານ":
      case "ໝົດ":
      case "ສິນຄ້າໝົດ":
        return "error";
      default:
        return "primary";
    }
  };

  // Price parsing
  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    const parsed = parseFloat(priceString);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Price formatting
  const formatPrice = (price: string): string => {
    const numPrice = parsePrice(price);
    return numPrice.toLocaleString('lo-LA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Unique statuses
  const uniqueStatuses = Array.from(
    new Set(products.filter(p => p.Status).map(product => product.Status))
  );

  // Total value
  const totalValue = filteredProducts.reduce((sum, product) => {
    return sum + parsePrice(product.Price);
  }, 0);

  // Modal controls
  const openDeleteModal = (productId: number) => {
    setDeletingProductId(productId);
    setShowDeleteModal(true);
    setDeleteError("");
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingProductId(null);
    setDeleteError("");
  };

  const openEditModal = (product: Product) => {
    setEditProduct({ ...product, ProductType_ID: product.ProductType_ID ?? product.ProductType_ID });
    setShowEditModal(true);
    setEditError("");
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditProduct(null);
    setEditError("");
  };

  // Return all state and functions
  return {
    products, setProducts,
    filteredProducts, setFilteredProducts,
    loading, error,
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
    openViewModal,
    closeViewModal,
    productTypes,
  };
}
