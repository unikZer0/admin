import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import OrderAnalytics from "../../components/admin/OrderAnalytics";
import {
  Package,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileText,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

// Define TypeScript interfaces
interface OrderItem {
  Cart_ID: number;
  Size: number;
  Color: string;
  Quantity: number;
  Unit_Price: string;
  Subtotal: string;
  Product_ID: number;
  Product_Name: string;
  Brand: string;
  Product_Image: string;
  Product_Type?: string;
}

interface Order {
  Order_ID: number;
  OID: string;
  Order_Date: string;
  Order_Status: string;
  Total_Amount: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  User_ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Village?: string;
  District?: string;
  Province?: string;
  Transportation?: string;
  Branch?: string;
  Tracking_Number?: string;
  Ship_Status?: string;
  Ship_Date?: string;
  Payment_Status?: string;
  Payment_Method?: string;
  Payment_Amount?: string;
  items: OrderItem[];
}

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalRevenue: string;
  averageOrderValue: string;
  monthlyTrends: Array<{
    month: string;
    orderCount: number;
    monthlyRevenue: string;
  }>;
  topProducts: Array<{
    Product_ID: number;
    Product_Name: string;
    Brand: string;
    timesOrdered: number;
    totalQuantitySold: number;
    totalRevenue: string;
  }>;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage, searchTerm, statusFilter, startDate, endDate, userIdFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (userIdFilter) params.append("userId", userIdFilter);

      const response = await axios.get(
        `http://localhost:3000/api/admin/orders?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data;
      setOrders(data.data || []);
      setTotalOrders(data.pagination?.totalOrders || 0);
      setTotalPages(data.pagination?.totalPages || 1);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await axios.get(
        `http://localhost:3000/api/admin/orders/stats?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setUserIdFilter("");
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      default:
        return "light";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LAK",
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-300">
            ກຳລັງໂຫລດຂໍ້ມູນການສັ່ງຊື້...
          </p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
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
          <Button
            onClick={fetchOrders}
            className="mt-4"
            variant="primary"
            startIcon={<RefreshCw />}
          >
            ລອງໃໝ່
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              ປະຫວັດການສັ່ງຊື້
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              ຈັດການ ແລະ ຕິດຕາມການສັ່ງຊື້ທັງໝົດ
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ລາຍການທັງໝົດ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ສຳເລັດແລ້ວ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ລໍຖ້າ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.pendingOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ລາຍໄດ້ທັງໝົດ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ຄົ້ນຫາ
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ຄົ້ນຫາຕາມ OID, ຊື່ລູກຄ້າ..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ສະຖານະ
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">ທັງໝົດ</option>
              <option value="pending">ລໍຖ້າ</option>
              <option value="processing">ກຳລັງດຳເນີນການ</option>
              <option value="shipped">ສົ່ງແລ້ວ</option>
              <option value="delivered">ຈັດສົ່ງແລ້ວ</option>
              <option value="completed">ສຳເລັດແລ້ວ</option>
              <option value="cancelled">ຍົກເລີກ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ວັນທີເລີ່ມ
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ວັນທີສິ້ນສຸດ
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User ID
            </label>
            <input
              type="number"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              placeholder="User ID"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-end gap-2">
                            <Button
                  onClick={() => handleSearch({} as React.FormEvent)}
                  variant="primary"
                  startIcon={<Search />}
                  className="flex-1"
                >
                  ຄົ້ນຫາ
                </Button>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  startIcon={<Filter />}
                >
                  ລ້າງ
                </Button>
          </div>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ລາຍການສັ່ງຊື້ ({totalOrders} ລາຍການ)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>OID</TableCell>
                <TableCell>ລູກຄ້າ</TableCell>
                <TableCell>ວັນທີ</TableCell>
                <TableCell>ສະຖານະ</TableCell>
                <TableCell>ຈຳນວນເງິນ</TableCell>
                <TableCell>ການຊຳລະ</TableCell>
                <TableCell>ການສົ່ງ</TableCell>
                <TableCell>ການດຳເນີນການ</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.Order_ID}>
                  <TableCell className="font-medium">{order.OID}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.FirstName} {order.LastName}</div>
                      <div className="text-sm text-gray-500">{order.Email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.Order_Date)}</TableCell>
                  <TableCell>
                    <Badge
                      color={getStatusColor(order.Order_Status)}
                      startIcon={getStatusIcon(order.Order_Status)}
                    >
                      {order.Order_Status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.Total_Amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">
                        {order.Payment_Status || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm">
                        {order.Ship_Status || "N/A"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                                <Button
              size="sm"
              variant="outline"
              startIcon={<Eye />}
              onClick={() => handleViewOrder(order)}
            >
              ເບິ່ງ
            </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                ສະແດງ {((currentPage - 1) * itemsPerPage) + 1} ຫາ {Math.min(currentPage * itemsPerPage, totalOrders)} ຈາກ {totalOrders} ລາຍການ
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ກ່ອນໜ້າ
                </Button>
                <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  ໜ້າທີ {currentPage} ຈາກ {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  ຕໍ່ໄປ
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeOrderModal}
          formatPrice={formatPrice}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      )}
    </div>
  );
}

// Order Detail Modal Component
interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  formatPrice: (price: string) => string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusIcon,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              ລາຍລະອຽດການສັ່ງຊື້ - {order.OID}
            </h2>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ຂໍ້ມູນການສັ່ງຊື້
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ສະຖານະ:</span>
                  <Badge
                    color={getStatusColor(order.Order_Status) as any}
                    startIcon={getStatusIcon(order.Order_Status)}
                  >
                    {order.Order_Status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ວັນທີສັ່ງຊື້:</span>
                  <span>{formatDate(order.Order_Date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ຈຳນວນເງິນ:</span>
                  <span className="font-medium">{formatPrice(order.Total_Amount)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ຂໍ້ມູນລູກຄ້າ
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{order.FirstName} {order.LastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{order.Email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{order.Phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {order.Village && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ທີ່ຢູ່ຈັດສົ່ງ
              </h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p>{order.Village}, {order.District}, {order.Province}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ການຂົນສົ່ງ: {order.Transportation} | ສາຂາ: {order.Branch}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Information */}
          {order.Payment_Status && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ຂໍ້ມູນການຊຳລະ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ສະຖານະ:</span>
                  <span>{order.Payment_Status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ວິທີ:</span>
                  <span>{order.Payment_Method}</span>
                </div>
                {order.Payment_Amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ຈຳນວນ:</span>
                    <span>{formatPrice(order.Payment_Amount)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipment Information */}
          {order.Tracking_Number && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ຂໍ້ມູນການສົ່ງ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ເລກຕິດຕາມ:</span>
                  <span>{order.Tracking_Number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ສະຖານະ:</span>
                  <span>{order.Ship_Status}</span>
                </div>
                {order.Ship_Date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ວັນທີສົ່ງ:</span>
                    <span>{formatDate(order.Ship_Date)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              ລາຍການສິນຄ້າ ({order.items.length} ລາຍການ)
            </h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>ສິນຄ້າ</TableCell>
                    <TableCell>ຂະໜາດ</TableCell>
                    <TableCell>ສີ</TableCell>
                    <TableCell>ຈຳນວນ</TableCell>
                    <TableCell>ລາຄາ</TableCell>
                    <TableCell>ລວມ</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.Cart_ID}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.Product_Image}
                            alt={item.Product_Name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{item.Product_Name}</div>
                            <div className="text-sm text-gray-500">{item.Brand}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.Size}</TableCell>
                      <TableCell>{item.Color}</TableCell>
                      <TableCell>{item.Quantity}</TableCell>
                      <TableCell>{formatPrice(item.Unit_Price)}</TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(item.Subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              ປິດ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
