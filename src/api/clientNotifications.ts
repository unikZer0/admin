import axios from "axios";

const API_URL = "http://localhost:3000/api/client/product";

// Get all notifications for the current user
export const getNotifications = (params?: {
  page?: number;
  limit?: number;
}) =>
  axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params,
  });

// Get unread notifications count
export const getUnreadCount = () =>
  axios.get(`${API_URL}/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Get unread notifications
export const getUnreadNotifications = () =>
  axios.get(`${API_URL}/notifications/unread`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Mark notification as read
export const markAsRead = (notificationId: number) =>
  axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Mark all notifications as read
export const markAllAsRead = () =>
  axios.put(`${API_URL}/notifications/read-all`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Delete notification
export const deleteNotification = (notificationId: number) =>
  axios.delete(`${API_URL}/notifications/${notificationId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

// Get notifications by type
export const getNotificationsByType = (type: string, params?: {
  page?: number;
  limit?: number;
}) =>
  axios.get(`${API_URL}/notifications/type/${type}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params,
  }); 
