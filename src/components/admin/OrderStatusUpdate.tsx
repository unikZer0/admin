import React, { useState } from "react";
import axios from "axios";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import {
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Truck,
  AlertCircle,
  Package,
  Save,
  X
} from "lucide-react";

interface OrderStatusUpdateProps {
  orderId: number;
  currentStatus: string;
  onStatusUpdate: (newStatus: string) => void;
  onClose?: () => void;
  showAsModal?: boolean;
}

const OrderStatusUpdate: React.FC<OrderStatusUpdateProps> = ({
  orderId,
  currentStatus,
  onStatusUpdate,
  onClose,
  showAsModal = false
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = [
    { value: "pending", label: "ລໍຖ້າ", icon: Clock, color: "warning" },
    { value: "processing", label: "ກຳລັງດຳເນີນການ", icon: Loader2, color: "info" },
    { value: "shipped", label: "ສົ່ງແລ້ວ", icon: Truck, color: "primary" },
    { value: "delivered", label: "ຈັດສົ່ງແລ້ວ", icon: Package, color: "success" },
    { value: "completed", label: "ສຳເລັດແລ້ວ", icon: CheckCircle, color: "success" },
    { value: "cancelled", label: "ຍົກເລີກ", icon: XCircle, color: "error" },
  ];

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      const response = await axios.put(
        `http://localhost:3000/api/admin/orders/${orderId}/status`,
        {
          Order_Status: selectedStatus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        onStatusUpdate(selectedStatus);
        if (onClose) {
          onClose();
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະ");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    if (statusOption) {
      const IconComponent = statusOption.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "default";
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          ອັບເດດສະຖານະການສັ່ງຊື້
        </h3>
                 {onClose && (
           <Button
             size="sm"
             variant="outline"
             onClick={onClose}
             startIcon={<X />}
           >
             ປິດ
           </Button>
         )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ສະຖານະປັດຈຸບັນ
          </label>
          <Badge
            color={getStatusColor(currentStatus) as any}
            startIcon={getStatusIcon(currentStatus)}
            className="text-sm"
          >
            {statusOptions.find(option => option.value === currentStatus)?.label || currentStatus}
          </Badge>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ສະຖານະໃໝ່
          </label>
          <div className="grid grid-cols-2 gap-2">
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                    selectedStatus === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || selectedStatus === currentStatus}
            startIcon={isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save />}
            variant="primary"
            className="flex-1"
          >
            {isUpdating ? "ກຳລັງອັບເດດ..." : "ອັບເດດສະຖານະ"}
          </Button>
          {onClose && (
                         <Button
               onClick={onClose}
               variant="outline"
               disabled={isUpdating}
             >
               ຍົກເລີກ
             </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (showAsModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {content}
    </div>
  );
};

export default OrderStatusUpdate; 
