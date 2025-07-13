import React, { useEffect, useState } from "react";
import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../../api/notifications";

// Notification type
interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Optionally, poll for new notifications every 60s
    // const interval = setInterval(() => { fetchNotifications(); fetchUnreadCount(); }, 60000);
    // return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getAllNotifications();
      console.log("Notifications API response:", res.data);
      setNotifications(
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : []
      );
      setError(null);
    } catch (err: any) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };


  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  const handleDelete = async (id: number) => {
    await deleteNotification(id);
    fetchNotifications();
  };

  return (
    <div className="relative inline-block text-left">
      {/* Bell Icon with Unread Badge */}
      <button
        className="relative focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label="Show notifications"
      >
        <svg
          className="w-7 h-7 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>
      {/* Dropdown */}
      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-4 border-b flex items-center justify-between">
            <span className="font-semibold text-gray-800 dark:text-white">Notifications</span>
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-start gap-2 px-4 py-3 border-b last:border-b-0 ${!n.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${n.isRead ? "bg-gray-200 text-gray-600" : "bg-blue-500 text-white"}`}>
                          {n.type}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white mt-1">{n.title}</div>
                      <div className="text-gray-600 dark:text-gray-300 text-sm">{n.message}</div>
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      {!n.isRead && (
                        <button
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => handleMarkAsRead(n.id)}
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        className="text-xs text-red-500 hover:underline"
                        onClick={() => handleDelete(n.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
