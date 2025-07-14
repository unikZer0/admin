import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

interface Shipment {
  Shipment_ID: number;
  Tracking_Number: string;
  Ship_Status: 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  Ship_Date: string;
  OID: string;
  Order_Date: string;
  Total_Amount: number;
  Order_Status: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Village: string;
  District: string;
  Province: string;
  Payment_Method?: string;
  Payment_Status?: string;
}

interface ShipmentStats {
  total: number;
  preparing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

const Shipment: React.FC = () => {
  const { theme } = useTheme();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<ShipmentStats>({
    total: 0,
    preparing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'http://localhost:3000/api/admin/shipment';

  useEffect(() => {
    fetchShipments();
    fetchStats();
  }, []);

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShipments(response.data.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateShipmentStatus = async (shipmentId: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/${shipmentId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh data
      fetchShipments();
      fetchStats();
      
      // Close modal
      setShowModal(false);
      setSelectedShipment(null);
      
      // Show success popup
      setSuccessMessage(`ອັບເດດສະຖານະເປັນ "${getStatusText(status)}" ສຳເລັດ!`);
      setShowSuccessPopup(true);
      
      // Auto hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error updating shipment status:', error);
      
      // Show error message to user
      const errorMessage = error.response?.data?.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະ';
      setSuccessMessage(errorMessage);
      setShowSuccessPopup(true);
      
      // Auto hide popup after 5 seconds for errors
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'ກຳລັງເຕີມພ້ອມ';
      case 'shipped': return 'ຈັດສົ່ງແລ້ວ';
      case 'delivered': return 'ຈັດສົ່ງສຳເລັດ';
      case 'cancelled': return 'ຍົກເລີກ';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'shipped': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
      case 'delivered': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      case 'cancelled': return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
      default: return null;
    }
  };

  const getPaymentMethodText = (method?: string) => {
    switch (method?.toLowerCase()) {
      case 'card':
        return 'ການຊຳລະເງິນ (Card)';
      case 'on delivery':
        return 'ຈ່າຍປາຍທາງ (COD)';
      default:
        return method || 'ບໍ່ລະບຸ';
    }
  };

  const getPaymentMethodColor = (method?: string) => {
    switch (method?.toLowerCase()) {
      case 'card':
        return 'bg-green-100 text-green-800';
      case 'on delivery':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'ຈ່າຍແລ້ວ';
      case 'pending':
        return 'ລໍຈ່າຍ';
      case 'failed':
        return 'ຈ່າຍບໍ່ສຳເລັດ';
      default:
        return status || 'ບໍ່ລະບຸ';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  // Filter shipments based on search query and status filter
  const filteredShipments = shipments.filter(shipment => {
         const matchesSearch = searchQuery === '' || 
       (shipment.Tracking_Number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
       (shipment.OID || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
       `${shipment.FirstName || ''} ${shipment.LastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || shipment.Ship_Status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          ລະບົບຈັດການການຈັດສົ່ງສິນຄ້າ
        </h1>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
          ຄົ້ນຫາແລະຈັດການສະຖານະການຈັດສົ່ງສິນຄ້າທັງໝົດ
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="ຄົ້ນຫາດ້ວຍເລກ Tracking Number, OID ຫຼືຊື່ລູກຄ້າ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`block w-full pl-10 pr-3 py-4 border rounded-xl text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>ທັງໝົດ</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>ກຳລັງເຕີມພ້ອມ</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.preparing}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>ຈັດສົ່ງແລ້ວ</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.shipped}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>ຈັດສົ່ງສຳເລັດ</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>ຍົກເລີກ</p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="all">ສະຖານະທັງໝົດ</option>
          <option value="preparing">ກຳລັງເຕີມພ້ອມ</option>
          <option value="shipped">ຈັດສົ່ງແລ້ວ</option>
          <option value="delivered">ຈັດສົ່ງສຳເລັດ</option>
          <option value="cancelled">ຍົກເລີກ</option>
        </select>
      </div>

      {/* Shipments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredShipments.map((shipment) => (
          <div key={shipment.Shipment_ID} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold text-lg">#{shipment.Tracking_Number}</h3>
                  <p className="text-blue-100 text-sm">ຄຳສັ່ງ: {shipment.OID}</p>
                  {/* Payment Information */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(shipment.Payment_Method)}`}>
                      {getPaymentMethodText(shipment.Payment_Method)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(shipment.Payment_Status)}`}>
                      {getPaymentStatusText(shipment.Payment_Status)}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(shipment.Ship_Status)}`}>
                  {getStatusIcon(shipment.Ship_Status)}
                  <span className="ml-1">{getStatusText(shipment.Ship_Status)}</span>
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {(shipment.FirstName || '').charAt(0)}{(shipment.LastName || '').charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {shipment.FirstName || ''} {shipment.LastName || ''}
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{shipment.Email}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{shipment.Phone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start space-x-2">
                <svg className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {shipment.Village || ''}, {shipment.District || ''}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{shipment.Province || ''}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h5 className={`text-sm font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ສະຖານະການຈັດສົ່ງ</h5>
              <div className="relative">
                <div className="flex items-center justify-between">
                  {/* Step 1: Preparing */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      shipment.Ship_Status === 'preparing' || shipment.Ship_Status === 'shipped' || shipment.Ship_Status === 'delivered'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-400'
                    }`}>
                      {shipment.Ship_Status === 'preparing' || shipment.Ship_Status === 'shipped' || shipment.Ship_Status === 'delivered' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">1</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      shipment.Ship_Status === 'preparing' || shipment.Ship_Status === 'shipped' || shipment.Ship_Status === 'delivered'
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}>ກຳລັງເຕີມພ້ອມ</span>
                  </div>

                  {/* Line 1 */}
                  <div className={`flex-1 h-0.5 mx-2 ${
                    shipment.Ship_Status === 'shipped' || shipment.Ship_Status === 'delivered'
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}></div>

                  {/* Step 2: Shipped */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      shipment.Ship_Status === 'shipped' || shipment.Ship_Status === 'delivered'
                        ? 'bg-green-500 border-green-500 text-white'
                        : shipment.Ship_Status === 'preparing'
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-400'
                    }`}>
                      {shipment.Ship_Status === 'shipped' || shipment.Ship_Status === 'delivered' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : shipment.Ship_Status === 'preparing' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">2</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      shipment.Ship_Status === 'shipped' || shipment.Ship_Status === 'delivered'
                        ? 'text-green-600'
                        : shipment.Ship_Status === 'preparing'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}>ຈັດສົ່ງແລ້ວ</span>
                  </div>

                  {/* Line 2 */}
                  <div className={`flex-1 h-0.5 mx-2 ${
                    shipment.Ship_Status === 'delivered'
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}></div>

                  {/* Step 3: Delivered */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      shipment.Ship_Status === 'delivered'
                        ? 'bg-green-500 border-green-500 text-white'
                        : shipment.Ship_Status === 'shipped'
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-400'
                    }`}>
                      {shipment.Ship_Status === 'delivered' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : shipment.Ship_Status === 'shipped' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">3</span>
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      shipment.Ship_Status === 'delivered'
                        ? 'text-green-600'
                        : shipment.Ship_Status === 'shipped'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`}>ຈັດສົ່ງສຳເລັດ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                  <div>ວັນທີ: {new Date(shipment.Ship_Date).toLocaleDateString('lo-LA')}</div>
                  {shipment.Payment_Method === 'on delivery' && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                        💰 ເກັບເງິນປາຍທາງ (COD)
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedShipment(shipment);
                    setShowModal(true);
                  }}
                  disabled={shipment.Ship_Status === 'cancelled'}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    shipment.Ship_Status === 'cancelled'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {shipment.Ship_Status === 'cancelled' ? 'ບໍ່ສາມາດອັບເດດໄດ້' : 'ອັບເດດສະຖານະ'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredShipments.length === 0 && (
        <div className="text-center py-12">
          <svg className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ບໍ່ພົບຂໍ້ມູນ</h3>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            {searchQuery ? 'ລອງຄົ້ນຫາດ້ວຍຄຳອື່ນ' : 'ບໍ່ມີຂໍ້ມູນການຈັດສົ່ງ'}
          </p>
        </div>
      )}

      {/* Status Update Modal */}
      {showModal && selectedShipment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl ${
            theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
          }`}>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  ອັບເດດສະຖານະການຈັດສົ່ງ
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedShipment(null);
                  }}
                  className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="space-y-2">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-medium">ເລກທີຕິດຕາມ:</span> {selectedShipment.Tracking_Number}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-medium">ລູກຄ້າ:</span> {selectedShipment.FirstName || ''} {selectedShipment.LastName || ''}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-medium">ວິທີການຈ່າຍ:</span>
                    <span className={`inline-flex items-center ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(selectedShipment.Payment_Method)}`}>
                      {getPaymentMethodText(selectedShipment.Payment_Method)}
                    </span>
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-medium">ສະຖານະການຈ່າຍ:</span>
                    <span className={`inline-flex items-center ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedShipment.Payment_Status)}`}>
                      {getPaymentStatusText(selectedShipment.Payment_Status)}
                    </span>
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className="font-medium">ສະຖານະປັດຈຸບັນ:</span>
                    <span className={`inline-flex items-center ml-2 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedShipment.Ship_Status)}`}>
                      {getStatusIcon(selectedShipment.Ship_Status)}
                      <span className="ml-1">{getStatusText(selectedShipment.Ship_Status)}</span>
                    </span>
                  </p>
                </div>
              </div>
              
              {selectedShipment.Ship_Status === 'cancelled' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ບໍ່ສາມາດອັບເດດສະຖານະໄດ້</h4>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>ການຈັດສົ່ງນີ້ຖືກຍົກເລີກແລ້ວ ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້</p>
                </div>
              ) : selectedShipment.Ship_Status === 'delivered' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ຈັດສົ່ງສຳເລັດແລ້ວ</h4>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>ການຈັດສົ່ງນີ້ເສັດສິ້ນແລ້ວ ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* COD Payment Notice */}
                  {selectedShipment.Payment_Method === 'on delivery' && (
                    <div className={`p-4 rounded-lg border-l-4 border-orange-500 ${theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-orange-200' : 'text-orange-800'}`}>
                            💰 ເກັບເງິນປາຍທາງ (COD)
                          </h3>
                          <div className={`mt-1 text-sm ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>
                            <p>ຢ່າລືມເກັບເງິນ {selectedShipment.Total_Amount?.toLocaleString()} K ຈາກການຈັດສົ່ງນີ້</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show only available status options based on current status */}
                  {selectedShipment.Ship_Status === 'preparing' && (
                    <>
                      <button
                        onClick={() => updateShipmentStatus(selectedShipment.Shipment_ID, 'shipped')}
                        className={`w-full flex items-center justify-between p-4 text-left border rounded-lg transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 hover:bg-blue-900 hover:border-blue-400'
                            : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ຈັດສົ່ງແລ້ວ</span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => updateShipmentStatus(selectedShipment.Shipment_ID, 'cancelled')}
                        className={`w-full flex items-center justify-between p-4 text-left border rounded-lg transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 hover:bg-red-900 hover:border-red-400'
                            : 'bg-white border-gray-200 hover:bg-red-50 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ຍົກເລີກ</span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {selectedShipment.Ship_Status === 'shipped' && (
                    <>
                      <button
                        onClick={() => updateShipmentStatus(selectedShipment.Shipment_ID, 'delivered')}
                        className={`w-full flex items-center justify-between p-4 text-left border rounded-lg transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 hover:bg-green-900 hover:border-green-400'
                            : 'bg-white border-gray-200 hover:bg-green-50 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ຈັດສົ່ງສຳເລັດ</span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => updateShipmentStatus(selectedShipment.Shipment_ID, 'cancelled')}
                        className={`w-full flex items-center justify-between p-4 text-left border rounded-lg transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 hover:bg-red-900 hover:border-red-400'
                            : 'bg-white border-gray-200 hover:bg-red-50 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ຍົກເລີກ</span>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            successMessage.includes('ສຳເລັດ') 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {successMessage.includes('ສຳເລັດ') ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipment;
