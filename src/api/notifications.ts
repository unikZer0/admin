import axios from "axios";

const API_URL = "http://localhost:3000/api/admin";

export const getAllNotifications = () =>
  axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const getUnreadNotifications = () =>
  axios.get(`${API_URL}/notifications/unread`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const markAsRead = (id: number) =>
  axios.put(`${API_URL}/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const markAllAsRead = () =>
  axios.put(`${API_URL}/notifications/read-all`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const deleteNotification = (id: number) =>
  axios.delete(`${API_URL}/notifications/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

export const getNotificationsByType = (type: string) =>
  axios.get(`${API_URL}/notifications/type/${type}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }); 
