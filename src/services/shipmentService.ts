import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/admin/shipment';

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export interface Shipment {
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
}

export interface ShipmentStats {
  total: number;
  preparing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export const shipmentService = {
  // Get all shipments
  getAllShipments: async (): Promise<Shipment[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw error;
    }
  },

  // Get shipment by ID
  getShipmentById: async (shipmentId: number): Promise<Shipment> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${shipmentId}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching shipment:', error);
      throw error;
    }
  },

  // Update shipment status
  updateShipmentStatus: async (shipmentId: number, status: string): Promise<void> => {
    try {
      await axios.put(
        `${API_BASE_URL}/${shipmentId}/status`,
        { status },
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      console.error('Error updating shipment status:', error);
      throw error;
    }
  },

  // Create new shipment
  createShipment: async (orderId: number): Promise<{ shipmentId: number; trackingNumber: string }> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        { orderId },
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating shipment:', error);
      throw error;
    }
  },

  // Get shipment statistics
  getShipmentStats: async (): Promise<ShipmentStats> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/overview`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching shipment stats:', error);
      throw error;
    }
  },
}; 