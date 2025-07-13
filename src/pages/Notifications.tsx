import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import NotificationSender from "../components/admin/NotificationSender";
import { getAllNotifications, markNotificationAsRead, deleteNotification } from "../api/adminNotifications";

interface Notification {
  Notification_ID: number;
  User_ID: number | null;
  Title: string;
  Message: string;
  Type: string;
  Is_Read: boolean;
  Created_At: string;
  Related_ID?: number;
  Related_Type?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications();
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.Notification_ID === notificationId 
            ? { ...notif, Is_Read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notif => notif.Notification_ID !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationSent = () => {
    fetchNotifications(); // Refresh the list
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.Is_Read) ||
      (filter === 'read' && notification.Is_Read);
    
    const matchesSearch = notification.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.Message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.Type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.Is_Read).length;

  return (
    <>
      <PageBreadcrumb pageTitle="Notifications Management" />
      
      <div className="space-y-6">
        {/* Notification Sender Section */}
        <ComponentCard title="Send Notifications">
          <div className="container px-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Send notifications to specific users or broadcast to all users
              </p>
            </div>
            <NotificationSender 
              onSuccess={handleNotificationSent}
              onError={(error: string) => {
                console.error("Failed to send notification:", error);
              }}
            />
          </div>
        </ComponentCard>

        {/* Notifications List Section */}
        <ComponentCard title={`All Notifications (${unreadCount} unread)`}>
          <div className="container px-6">
            {/* Filters and Search */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'unread' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Unread ({notifications.filter(n => !n.Is_Read).length})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filter === 'read' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  Read
                </button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Notifications List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No notifications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.Notification_ID}
                    className={`rounded-lg border p-4 ${
                      notification.Is_Read 
                        ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800' 
                        : 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {notification.Title}
                          </h4>
                          {!notification.Is_Read && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              New
                            </span>
                          )}
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            notification.Type === 'order' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            notification.Type === 'product' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            notification.Type === 'promotion' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}>
                            {notification.Type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.Message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>
                            {notification.User_ID ? `User ID: ${notification.User_ID}` : 'Broadcast'}
                          </span>
                          <span>
                            {new Date(notification.Created_At).toLocaleString()}
                          </span>
                          {notification.Related_ID && (
                            <span>
                              Related: {notification.Related_Type} #{notification.Related_ID}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {!notification.Is_Read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.Notification_ID)}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.Notification_ID)}
                          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
} 
