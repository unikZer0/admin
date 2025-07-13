import React, { useState } from "react";
import { sendNotificationToUser, broadcastNotification } from "../../api/adminNotifications";
import { Modal } from "../ui/modal"; 

interface NotificationSenderProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function NotificationSender({ onSuccess, onError }: NotificationSenderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    User_ID: "",
    Title: "",
    Message: "",
    Type: "system" as 'order' | 'product' | 'system' | 'promotion',
    Related_ID: "",
    Related_Type: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isBroadcast) {
        // Broadcast to all users
        await broadcastNotification({
          Title: formData.Title,
          Message: formData.Message,
          Type: formData.Type,
          Related_ID: formData.Related_ID ? parseInt(formData.Related_ID) : undefined,
          Related_Type: formData.Related_Type || undefined
        });
      } else {
        // Send to specific user
        if (!formData.User_ID) {
          throw new Error("User ID is required for specific user notification");
        }
        
        await sendNotificationToUser({
          User_ID: parseInt(formData.User_ID),
          Title: formData.Title,
          Message: formData.Message,
          Type: formData.Type,
          Related_ID: formData.Related_ID ? parseInt(formData.Related_ID) : undefined,
          Related_Type: formData.Related_Type || undefined
        });
      }

      // Reset form
      setFormData({
        User_ID: "",
        Title: "",
        Message: "",
        Type: "system",
        Related_ID: "",
        Related_Type: ""
      });
      
      setIsOpen(false);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to send notification";
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Send Notification
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h3 className="text-lg font-semibold mb-4">Send Notification</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
              {/* Broadcast Toggle */}
              <div className="flex items-center gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isBroadcast}
                    onChange={(e) => setIsBroadcast(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Broadcast to all users
                  </span>
                </label>
              </div>

              {/* User ID (only for specific user) */}
              {!isBroadcast && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User ID *
                  </label>
                  <input
                    type="number"
                    name="User_ID"
                    value={formData.User_ID}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter user ID"
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="Title"
                  value={formData.Title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Notification title"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  name="Message"
                  value={formData.Message}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Notification message"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="Type"
                  value={formData.Type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="system">System</option>
                  <option value="order">Order</option>
                  <option value="product">Product</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>

              {/* Related ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Related ID (optional)
                </label>
                <input
                  type="number"
                  name="Related_ID"
                  value={formData.Related_ID}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Related order/product ID"
                />
              </div>

              {/* Related Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Related Type (optional)
                </label>
                <input
                  type="text"
                  name="Related_Type"
                  value={formData.Related_Type}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="order, product, etc."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Sending..." : isBroadcast ? "Broadcast" : "Send"}
                </button>
              </div>
            </form>
      </Modal>
    </>
  );
}
