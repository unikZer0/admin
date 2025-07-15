import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import Button from '../ui/button/Button';
import Badge from '../ui/badge/Badge';
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  MapPin,
  UserPlus,
  RefreshCw,
  Loader2,
  Pencil,
  Trash2,
  TrendingUp,
  Package,
  Star
} from 'lucide-react';

// Customer interface with additional fields
interface Customer {
  User_ID: number;
  UID: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Datebirth: string;
  Sex: string;
  Role_id: number;
  Images?: string;
  Registration_Date: string;
  created_at: string;
  updated_at: string;
  // Additional customer-specific data
  totalOrders?: number;
  totalSpent?: string;
  lastOrderDate?: string;
  addressCount?: number;
  isActive?: boolean;
}

// Customer statistics
interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  totalRevenue: string;
  averageOrderValue: string;
  topCustomers: Customer[];
}

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('Registration_Date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/admin/getusers/',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Filter only customers (Role_id = 3) and add additional data
      const allUsers = response.data.data || response.data.users || response.data;
      const customersOnly = allUsers.filter((user: any) => user.Role_id === 3);
      
      // Fetch additional customer data (orders, addresses, etc.)
      const customersWithData = await Promise.all(
        customersOnly.map(async (customer: Customer) => {
          try {
            // Get customer orders
            const ordersResponse = await axios.get(
              `http://localhost:3000/api/admin/orders/user/${customer.User_ID}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const orders = ordersResponse.data.data || [];

            // Get customer addresses
            const addressResponse = await axios.get(
              `http://localhost:3000/api/admin/addresses/user/${customer.User_ID}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const addresses = addressResponse.data.data || [];

            return {
              ...customer,
              totalOrders: orders.length,
              totalSpent: orders.reduce((sum: number, order: any) => 
                sum + parseFloat(order.Total_Amount || 0), 0).toFixed(2),
              lastOrderDate: orders.length > 0 ? orders[0].Order_Date : null,
              addressCount: addresses.length,
              isActive: orders.length > 0
            };
          } catch (error) {
            // If API calls fail, return customer with default values
            return {
              ...customer,
              totalOrders: 0,
              totalSpent: '0.00',
              lastOrderDate: null,
              addressCount: 0,
              isActive: false
            };
          }
        })
      );

      setCustomers(customersWithData);
      calculateStats(customersWithData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (customerData: Customer[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: CustomerStats = {
      totalCustomers: customerData.length,
      activeCustomers: customerData.filter(c => c.isActive).length,
      newCustomersThisMonth: customerData.filter(c => 
        new Date(c.Registration_Date) >= thisMonth
      ).length,
      totalRevenue: customerData.reduce((sum, c) => 
        sum + parseFloat(c.totalSpent || '0'), 0
      ).toFixed(2),
      averageOrderValue: customerData.length > 0 ? 
        (customerData.reduce((sum, c) => sum + parseFloat(c.totalSpent || '0'), 0) / 
         customerData.filter(c => c.totalOrders && c.totalOrders > 0).length).toFixed(2) : '0.00',
      topCustomers: customerData
        .sort((a, b) => parseFloat(b.totalSpent || '0') - parseFloat(a.totalSpent || '0'))
        .slice(0, 5)
    };

    setStats(stats);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = 
        customer.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.UID.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' && customer.isActive) ||
        (statusFilter === 'inactive' && !customer.isActive);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof Customer];
      let bValue = b[sortBy as keyof Customer];

      if (sortBy === 'totalSpent') {
        aValue = parseFloat(a.totalSpent || '0');
        bValue = parseFloat(b.totalSpent || '0');
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? 
          aValue.localeCompare(bValue) : 
          bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  // Handle customer deletion
  const handleDelete = async (customerId: number, customerName: string) => {
    const result = await Swal.fire({
      title: 'ທ່ານແນ່ໃຈບໍ?',
      text: `ທ່ານຕ້ອງການລຶບລູກຄ້າ ${customerName}? ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ແນ່ໃຈ, ລຶບ!',
      cancelButtonText: 'ຍົກເລີກ'
    });

    if (!result.isConfirmed) return;

    setDeleting(customerId);
    try {
      await axios.post(
        `http://localhost:3000/api/admin/delete/${customerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      setCustomers(customers.filter(customer => customer.User_ID !== customerId));
      
      Swal.fire(
        'ລຶບແລ້ວ!',
        `${customerName} ໄດ້ຖືກລຶບສຳເລັດແລ້ວ.`,
        'success'
      );
    } catch (err: any) {
      Swal.fire(
        'ຂໍ້ຜິດພາດ!',
        err.response?.data?.message || 'ລົ້ມເຫລວໃນການລຶບລູກຄ້າ',
        'error'
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const closeCustomerModal = () => {
    setShowCustomerModal(false);
    setSelectedCustomer(null);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCustomer(null);
    fetchCustomers(); // Refresh the list after edit
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lo-LA');
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('lo-LA', {
      style: 'currency',
      currency: 'LAK',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-300">
            ກຳລັງໂຫລດຂໍ້ມູນລູກຄ້າ...
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
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ເກີດຂໍ້ຜິດພາດ
          </h3>
          <p className="text-red-500 text-center max-w-md">{error}</p>
          <Button
            onClick={fetchCustomers}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              ຈັດການລູກຄ້າ
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              ລາຍການລູກຄ້າທັງໝົດ {customers.length} ຄົນ
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ລູກຄ້າທັງໝົດ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCustomers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ລູກຄ້າທີ່ໃຊ້ງານ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeCustomers}
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

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ຄ່າສັ່ງຊື້ສະເລ່ຍ
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(stats.averageOrderValue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ຄົ້ນຫາ
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ຄົ້ນຫາຕາມຊື່, ອີເມວ, UID..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ສະຖານະ
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">ທັງໝົດ</option>
              <option value="active">ລູກຄ້າທີ່ໃຊ້ງານ</option>
              <option value="inactive">ລູກຄ້າທີ່ບໍ່ໃຊ້ງານ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ຈັດຮຽງຕາມ
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="Registration_Date">ວັນທີລົງທະບຽນ</option>
              <option value="FirstName">ຊື່</option>
              <option value="totalOrders">ຈຳນວນການສັ່ງຊື້</option>
              <option value="totalSpent">ຈຳນວນເງິນທີ່ໃຊ້</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ລຳດັບ
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="desc">ຫຼາຍຫານ້ອຍ</option>
              <option value="asc">ນ້ອຍຫາຫຼາຍ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                ລາຍການລູກຄ້າ
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ສະແດງລູກຄ້າທັງໝົດ {filteredCustomers.length} ຄົນ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">ລະບົບອອນລາຍ</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Modern Table Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-8 gap-6 px-8 py-4">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    ລູກຄ້າ
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    UID
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    ຂໍ້ມູນຕິດຕໍ່
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    ການສັ່ງຊື້
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    ຈຳນວນເງິນ
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    ສະຖານະ
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    ວັນທີລົງທະບຽນ
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    ການດຳເນີນການ
                  </span>
                </div>
              </div>
            </div>

            {/* Modern Table Body */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCustomers.map((customer, index) => (
                <div 
                  key={customer.User_ID}
                  className={`grid grid-cols-8 gap-6 px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 ${
                    index % 2 === 0 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50/50 dark:bg-gray-800/50'
                  }`}
                >
                  {/* Customer Info */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={customer.Images || '/default-avatar.png'}
                          alt={customer.FirstName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-gray-600 shadow-md"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-600 ${
                          customer.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {customer.FirstName} {customer.LastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {customer.Sex}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UID */}
                  <div className="flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                      <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                        {customer.UID}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{customer.Email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{customer.Phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Orders */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {customer.totalOrders}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        ການສັ່ງຊື້
                      </div>
                    </div>
                  </div>

                  {/* Total Spent */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatPrice(customer.totalSpent || '0')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ລວມທັງໝົດ
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center">
                    <div className={`px-4 py-2 rounded-full text-xs font-medium ${
                      customer.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <div className="flex items-center gap-1">
                        {customer.isActive ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            ໃຊ້ງານ
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            ບໍ່ໃຊ້ງານ
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Registration Date */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(customer.Registration_Date)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ລົງທະບຽນ
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="p-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200 group"
                        title="ເບິ່ງລາຍລະອຽດ"
                      >
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                                             <button
                         onClick={() => handleEditCustomer(customer)}
                         className="p-2 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 rounded-lg transition-colors duration-200 group"
                         title="ແກ້ໄຂ"
                       >
                         <Pencil className="w-4 h-4 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
                       </button>
                      <button
                        onClick={() => handleDelete(customer.User_ID, `${customer.FirstName} ${customer.LastName}`)}
                        disabled={deleting === customer.User_ID}
                        className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-200 group disabled:opacity-50"
                        title="ລຶບ"
                      >
                        {deleting === customer.User_ID ? (
                          <Loader2 className="w-4 h-4 text-red-600 dark:text-red-400 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-200" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  ບໍ່ມີລູກຄ້າ
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  ບໍ່ພົບລູກຄ້າທີ່ຕົງກັບການຄົ້ນຫາຂອງທ່ານ
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {showCustomerModal && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={closeCustomerModal}
          formatDate={formatDate}
          formatPrice={formatPrice}
        />
      )}

      {/* Edit Customer Modal */}
      {showEditModal && editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={closeEditModal}
          onUpdate={fetchCustomers}
          editLoading={editLoading}
          setEditLoading={setEditLoading}
        />
      )}
    </div>
  );
};

// Customer Detail Modal Component
interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
  formatDate: (date: string) => string;
  formatPrice: (price: string) => string;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  formatDate,
  formatPrice,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              ລາຍລະອຽດລູກຄ້າ - {customer.UID}
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
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ຂໍ້ມູນສ່ວນຕົວ
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ຊື່:</span>
                  <span>{customer.FirstName} {customer.LastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ເພດ:</span>
                  <span>{customer.Sex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ວັນເດືອນປີເກີດ:</span>
                  <span>{customer.Datebirth ? formatDate(customer.Datebirth) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">ວັນທີລົງທະບຽນ:</span>
                  <span>{formatDate(customer.Registration_Date)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ຂໍ້ມູນຕິດຕໍ່
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{customer.Email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{customer.Phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              ສະຖິຕິການຊື້ຂາຍ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {customer.totalOrders}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ການສັ່ງຊື້ທັງໝົດ
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(customer.totalSpent || '0')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ຈຳນວນເງິນທີ່ໃຊ້
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {customer.addressCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  ທີ່ຢູ່ທີ່ບັນທຶກ
                </div>
              </div>
            </div>
          </div>

          {/* Last Order Information */}
          {customer.lastOrderDate && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                ການສັ່ງຊື້ຄັ້ງສຸດທ້າຍ
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(customer.lastOrderDate)}</span>
              </div>
            </div>
          )}
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

// Edit Customer Modal Component
interface EditCustomerModalProps {
  customer: Customer;
  onClose: () => void;
  onUpdate: () => void;
  editLoading: boolean;
  setEditLoading: (loading: boolean) => void;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  customer,
  onClose,
  onUpdate,
  editLoading,
  setEditLoading,
}) => {
  const [formData, setFormData] = useState({
    FirstName: customer.FirstName,
    LastName: customer.LastName,
    Email: customer.Email,
    Phone: customer.Phone,
    Role_id: customer.Role_id || 3, // Ensure Role_id is included
    Sex: customer.Sex,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    
    try {
      console.log('Sending update data:', formData);
      console.log('Customer ID:', customer.User_ID);
      
      const response = await axios.post(
        `http://localhost:3000/api/admin/update/${customer.User_ID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Update response:', response.data);
      
      Swal.fire({
        title: 'ສຳເລັດ!',
        text: 'ຂໍ້ມູນລູກຄ້າຖືກອັບເດດແລ້ວ',
        icon: 'success',
        confirmButtonText: 'ຕົກລົງ'
      });
      
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error('Update error:', error);
      console.error('Error response:', error.response?.data);
      
      Swal.fire({
        title: 'ຂໍ້ຜິດພາດ!',
        text: error.response?.data?.message || 'ລົ້ມເຫລວໃນການອັບເດດຂໍ້ມູນ',
        icon: 'error',
        confirmButtonText: 'ຕົກລົງ'
      });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              ແກ້ໄຂຂໍ້ມູນລູກຄ້າ
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Avatar */}
          <div className="flex items-center gap-4">
            <img
              src={customer.Images || '/default-avatar.png'}
              alt={customer.FirstName}
              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600"
            />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {customer.FirstName} {customer.LastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                UID: {customer.UID}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ຊື່
              </label>
              <input
                type="text"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ນາມສະກຸນ
              </label>
              <input
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ອີເມວ
            </label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ເບີໂທລະສັບ
            </label>
            <input
              type="tel"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ເພດ
            </label>
            <select
              name="Sex"
              value={formData.Sex}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="Male">ຊາຍ</option>
              <option value="Female">ຍິງ</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              disabled={editLoading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {editLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ກຳລັງບັນທຶກ...
                </div>
              ) : (
                'ບັນທຶກການປ່ຽນແປງ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerTable; 
