import React, { useEffect, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationsByType
} from "../../api/clientNotifications";
import Badge from "../ui/badge/Badge";

interface Notification {
  Notification_ID: number;
  Title: string;
  Message: string;
  Type: 'order' | 'product' | 'system' | 'promotion';
  Status: 'read' | 'unread';
  Related_ID?: number;
  Related_Type?: string;
  Created_At: string;
}

export default function ClientNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [currentPage, selectedType, showUnreadOnly]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let response;

      if (showUnreadOnly) {
        response = await getUnreadNotifications();
        setNotifications(response.data.data || []);
        setTotalPages(1);
      } else if (selectedType !== 'all') {
        response = await getNotificationsByType(selectedType, {
          page: currentPage,
          limit: itemsPerPage
        });
        setNotifications(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        response = await getNotifications({
          page: currentPage,
          limit: itemsPerPage
        });
        setNotifications(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }

      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.Notification_ID === notificationId 
            ? { ...notif, Status: 'read' as const }
            : notif
        )
      );
      fetchUnreadCount();
    } catch (error: any) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, Status: 'read' as const }))
      );
      setUnreadCount(0);
    } catch (error: any) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      // Remove from local state
      setNotifications(prev => 
        prev.filter(notif => notif.Notification_ID !== notificationId)
      );
      fetchUnreadCount();
    } catch (error: any) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '📦';
      case 'product': return '🛍️';
      case 'system': return '⚙️';
      case 'promotion': return '🎉';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'info';
      case 'product': return 'success';
      case 'system': return 'warning';
      case 'promotion': return 'primary';
      default: return 'light';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              My Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value="order">Orders</option>
          <option value="product">Products</option>
          <option value="system">System</option>
          <option value="promotion">Promotions</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => {
              setShowUnreadOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Show unread only
          </span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2 text-gray-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl">📭</span>
            <p className="mt-2">No notifications found</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <div
                key={notification.Notification_ID}
                className={`rounded-lg border p-4 transition-all hover:shadow-md ${
                  notification.Status === 'unread'
                    ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{getNotificationIcon(notification.Type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {notification.Title}
                        </h3>
                        <Badge
                          size="sm"
                          color={getNotificationColor(notification.Type)}
                        >
                          {notification.Type}
                        </Badge>
                        {notification.Status === 'unread' && (
                          <Badge size="sm" color="primary">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        {notification.Message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(notification.Created_At)}</span>
                        {notification.Related_ID && (
                          <span>ID: {notification.Related_ID}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {notification.Status === 'unread' && (
                      <button
                        onClick={() => handleMarkAsRead(notification.Notification_ID)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.Notification_ID)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 
