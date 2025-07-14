import { useState, useEffect } from "react";
import axios from "axios";
// ... import interface Product, NewProductData

// Inventory interface
export interface InventoryItem {
  Inventory_ID?: number;
  Size: string;
  Color: string;
  Quantity: number;
}

// Product interface based on your API response
export interface Product {
  Product_ID: number;
  PID: string;
  Name: string;
  Brand: string;
  Price: number;
  Description: string;
  Status: string;
  Image: string;
  productType_ID: number | undefined;
  Added_By: string;
  productType?: string; // ชื่อประเภทสินค้า (จาก join backend)
  totalStock?: number; // จำนวนสินค้าคงเหลือทั้งหมด
  inventory?: InventoryItem[]; // ข้อมูล inventory
}

// New product form data interface
export interface NewProductData {
  Name: string;
  Brand: string;
  Price: string;
  Description: string;
  Status: string;
  Image: string;
  productType_ID: number | undefined;
  Added_By: string;
  inventory: InventoryItem[];
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
      return localStorage.getItem("userId") || localStorage.getItem("username") || "admin";
    } catch (error) {
      console.warn("LocalStorage not available:", error);
      return "admin";
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
    productType_ID: undefined, 
    Added_By: getUserId() || "admin",
    inventory: [{ Size: "", Color: "", Quantity: 0 }]
  });

  const userRole = getUserRole();

  const handleEditProduct = async (e: React.FormEvent & { target?: { inventory?: InventoryItem[] } }) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
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
    
    // Validate price range (decimal(10,2) = max 99,999,999.99)
    const price = Number(editProduct.Price);
    if (price < 10000) {
      setEditError("ລາຄາຂັ້ນຕ່ຳທີ່ອະນຸຍາດ: 10,000 ກີບ");
      return;
    }
    if (price > 99999999.99) {
      setEditError("ລາຄາສູງສຸດທີ່ອະນຸຍາດ: 99,999,999.99 ກີບ");
      return;
    }
    
    if (!editProduct.productType_ID || editProduct.productType_ID === 0) {
      setEditError("ກະລຸນາເລືອກປະເພດສິນຄ້າ");
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
      
      // Get inventory from event or fallback to editProduct.inventory
      const inventoryData = (e.target as any)?.inventory || editProduct.inventory || [];
      console.log("handleEditProduct - Inventory data:", inventoryData); // Debug log

      await axios.put(
        `http://localhost:3000/api/admin/products/${editProduct.Product_ID}`,
        {
          Name: editProduct.Name,
          Brand: editProduct.Brand,
          Price: Number(editProduct.Price),
          Description: editProduct.Description,
          Status: editProduct.Status,
          Image: editProduct.Image,
          productType_ID: editProduct.productType_ID,
          Added_By: editProduct.Added_By,
          inventory: inventoryData
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

  const handleViewProduct = async (productId: number) => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/admin/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data) {
        setViewProduct(response.data.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
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
      productType_ID: undefined,
      Added_By: getUserId() || "admin",
      inventory: [{ Size: "", Color: "", Quantity: 0 }]
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`handleInputChange - ${name}:`, value, "Type:", typeof value); // Debug log
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === "productType_ID" ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmitNewProduct = async (e: React.FormEvent & { target?: { inventory?: InventoryItem[] } }) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    
    // Validate required fields
    if (!newProduct.Name.trim()) {
      alert("ກະລຸນາໃສ່ຊື່ສິນຄ້າ");
      return;
    }
    if (!newProduct.Brand.trim()) {
      alert("ກະລຸນາໃສ່ແບຣນ");
      return;
    }
    if (!newProduct.Price || isNaN(Number(newProduct.Price))) {
      alert("ກະລຸນາໃສ່ລາຄາທີ່ຖືກຕ້ອງ");
      return;
    }
    
    // Validate price range (decimal(10,2) = max 99,999,999.99)
    const price = Number(newProduct.Price);
    if (price < 10000) {
      alert("ລາຄາຂັ້ນຕ່ຳທີ່ອະນຸຍາດ: 10,000 ກີບ");
      return;
    }
    if (price > 99999999.99) {
      alert("ລາຄາສູງສຸດທີ່ອະນຸຍາດ: 99,999,999.99 ກີບ");
      return;
    }
    
    if (!newProduct.productType_ID || newProduct.productType_ID === 0) {
      alert("ກະລຸນາເລືອກປະເພດສິນຄ້າ");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getToken();
      if (!token) {
        alert("ບໍ່ພົບ Token");
        setIsSubmitting(false);
        return;
      }

      // Get inventory from event target or use newProduct.inventory as fallback
      const validInventory = (e.target?.inventory || newProduct.inventory).filter(
        item => item.Size && item.Color && item.Quantity >= 0
      );

      console.log("Sending inventory to backend:", validInventory); // Debug log

      await axios.post(
        "http://localhost:3000/api/admin/products/create",
        {
          Name: newProduct.Name,
          Brand: newProduct.Brand,
          Price: Number(newProduct.Price),
          Description: newProduct.Description,
          Status: newProduct.Status,
          Image: newProduct.Image,
          productType_ID: newProduct.productType_ID,
          Added_By: newProduct.Added_By,
          inventory: validInventory
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      handleCloseModal();
      fetchProducts();
      options.onAddSuccess?.();
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມສິນຄ້າ");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) {
        setError("ບໍ່ພົບ Token");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/admin/products",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data) {
        console.log("Frontend - Products data:", response.data.data); // Debug log
        console.log("Frontend - Sample product totalStock:", response.data.data[0]?.totalStock); // Debug log
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າ");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProductTypes = async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/admin/product-types",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data) {
        console.log("Product types fetched:", response.data.data); // Debug log
        setProductTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  // Filter products based on search term and status
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.PID.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((product) => getStatusByStock(product.totalStock) === selectedStatus);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedStatus]);

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
    fetchProductTypes();
  }, []);

  // ฟังก์ชันคำนวณสถานะตามจำนวนสินค้าคงคลัง
  const getStatusByStock = (totalStock: number | string | undefined): string => {
    // แปลงเป็น number และจัดการ undefined
    const stockNumber = typeof totalStock === 'string' ? parseInt(totalStock) || 0 : totalStock || 0;
    console.log("getStatusByStock - Input totalStock:", totalStock, "Type:", typeof totalStock, "Converted:", stockNumber); // Debug log
    const status = stockNumber === 0 ? "ໝົດ" : 
                   stockNumber >= 1 && stockNumber <= 9 ? "ເຫຼືອໜ້ອຍ" : "ມີຂາຍ";
    console.log("getStatusByStock - Calculated status:", status); // Debug log
    return status;
  };

  const getStatusColor = (
    status: string
  ): "success" | "warning" | "error" | "info" | "primary" => {
    switch (status) {
      case "ມີຂາຍ":
        return "success";
      case "ເຫຼືອໜ້ອຍ":
        return "warning";
      case "ໝົດ":
        return "error";
      default:
        return "info";
    }
  };

  const parsePrice = (priceString: string): number => {
    return parseFloat(priceString.replace(/[^\d.-]/g, "")) || 0;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("lo-LA", {
      style: "currency",
      currency: "LAK",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const openDeleteModal = (productId: number) => {
    setDeletingProductId(productId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeletingProductId(null);
    setShowDeleteModal(false);
    setDeleteError("");
  };

  const openEditModal = async (product: Product) => {
    try {
      // ดึงข้อมูล inventory สำหรับสินค้านี้
      const token = getToken();
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/admin/products/${product.Product_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data) {
        // รวมข้อมูล product กับ inventory และแปลง productType_ID เป็น number
        const productWithInventory = {
          ...product,
          ...response.data.data,
          productType_ID: response.data.data.productType_ID ? parseInt(response.data.data.productType_ID) : undefined,
          inventory: response.data.data.inventory || []
        };
        console.log("Product data from API:", response.data.data); // Debug log
        console.log("Product with inventory:", productWithInventory); // Debug log
        console.log("ProductType_ID:", productWithInventory.productType_ID); // Debug log
        setEditProduct(productWithInventory);
        setShowEditModal(true);
      } else {
        // ถ้าไม่มีข้อมูล inventory ให้ใช้ข้อมูลเดิม
        const productWithNumberType = {
          ...product,
          productType_ID: product.productType_ID ? parseInt(product.productType_ID.toString()) : undefined
        };
        console.log("Using original product data:", productWithNumberType); // Debug log
        console.log("Original ProductType_ID:", productWithNumberType.productType_ID); // Debug log
        setEditProduct(productWithNumberType);
        setShowEditModal(true);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      // ถ้าเกิด error ให้ใช้ข้อมูลเดิม
      setEditProduct(product);
      setShowEditModal(true);
    }
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setShowEditModal(false);
    setEditError("");
  };

  // Calculate total value of all products
  const totalValue = filteredProducts.reduce((total, product) => {
    return total + (product.Price * (product.totalStock || 0));
  }, 0);

  // Get unique statuses for filter (based on stock levels)
  const uniqueStatuses = Array.from(new Set(products.map((product) => getStatusByStock(product.totalStock))));

  return {
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
  };
}
