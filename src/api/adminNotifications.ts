import axios from "axios";

const API_URL = "http://localhost:3000/api/admin/";

// Send notification to specific user
export const sendNotificationToUser = (data: {
  User_ID: number;
  Title: string;
  Message: string;
  Type?: 'order' | 'product' | 'system' | 'promotion';
  Related_ID?: number;
  Related_Type?: string;
}) =>
  axios.post(`${API_URL}/notifications/user`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Broadcast notification to all users
export const broadcastNotification = (data: {
  Title: string;
  Message: string;
  Type?: 'order' | 'product' | 'system' | 'promotion';
  Related_ID?: number;
  Related_Type?: string;
}) =>
  axios.post(`${API_URL}/notifications/broadcast`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Get all notifications (admin view)
export const getAllNotifications = (params?: {
  page?: number;
  limit?: number;
  userId?: number;
  type?: string;
  status?: string;
}) =>
  axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params,
  });

// Get notification statistics
export const getNotificationStats = () =>
  axios.get(`${API_URL}/notifications/stats`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Delete notification (admin)
export const deleteNotification = (notificationId: number) =>
  axios.delete(`${API_URL}/notifications/${notificationId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Mark notification as read (admin override)
export const markNotificationAsRead = (notificationId: number) =>
  axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }); 
