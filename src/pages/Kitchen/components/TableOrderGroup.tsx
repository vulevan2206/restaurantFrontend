import { updateOrder } from "@/apis/order.api";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/types/order.type";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ChefHat, Clock, Users, ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TableOrderGroupProps {
  tableNumber: number;
  orders: Order[];
  onStatusUpdate: () => void;
}

const statusConfig = {
  IN_PROGRESS: {
    label: "Đang xử lý",
    color: "bg-amber-500",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    borderColor: "border-amber-500",
  },
  COOKING: {
    label: "Đang nấu",
    color: "bg-blue-500",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    borderColor: "border-blue-500",
  },
  SERVED: {
    label: "Đã phục vụ",
    color: "bg-green-500",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    borderColor: "border-green-500",
  },
};

export default function TableOrderGroup({
  tableNumber,
  orders,
  onStatusUpdate,
}: TableOrderGroupProps) {
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, newStatus }: { orderId: string; newStatus: string }) =>
      updateOrder({
        order_id: orderId,
        status: newStatus,
      }),
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Trạng thái đơn hàng đã được cập nhật",
      });
      // Force immediate refetch
      onStatusUpdate();
    },
    onError: (error: any) => {
      console.error("Update order error:", error);
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderMutation.mutate({ orderId, newStatus });
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "IN_PROGRESS":
        return "COOKING";
      case "COOKING":
        return "SERVED";
      default:
        return null;
    }
  };

  const getPreviousStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "COOKING":
        return "IN_PROGRESS";
      case "SERVED":
        return "COOKING";
      default:
        return null;
    }
  };

  // Get customer name from first order (all orders from same table should have same customer)
  const customerName = orders[0]?.customer_name || "Khách";

  // Get the most recent order time
  const latestOrderTime = orders.reduce((latest, order) => {
    const orderTime = new Date(order.createdAt);
    return orderTime > latest ? orderTime : latest;
  }, new Date(0));

  const timeAgo = formatDistanceToNow(latestOrderTime, {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border-2 border-slate-200 dark:border-slate-700 p-4 hover:shadow-xl transition-shadow">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md">
            Bàn {tableNumber}
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {customerName}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </Badge>
          <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
            {orders.length} món
          </Badge>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((order) => {
          const config = statusConfig[order.status as keyof typeof statusConfig];
          const nextStatus = getNextStatus(order.status);
          const previousStatus = getPreviousStatus(order.status);

          return (
            <div
              key={order._id}
              className={`bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-lg p-3 border-l-4 ${config?.borderColor || "border-slate-300"} hover:shadow-md transition-shadow`}
            >
              {/* Product Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2 flex-1">
                  <ChefHat className="w-5 h-5 text-slate-600 dark:text-slate-300 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-base text-slate-800 dark:text-white">
                      {order.product?.name || "Sản phẩm không xác định"}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      SL: <span className="font-semibold">{order.buy_count}</span>
                    </p>
                  </div>
                </div>
                <Badge className={config?.badgeColor}>
                  {config?.label || order.status}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {previousStatus && (
                  <Button
                    onClick={() => handleStatusChange(order._id, previousStatus)}
                    disabled={updateOrderMutation.isLoading}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 hover:bg-slate-100 dark:hover:bg-slate-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                  </Button>
                )}
                {nextStatus && (
                  <Button
                    onClick={() => handleStatusChange(order._id, nextStatus)}
                    disabled={updateOrderMutation.isLoading}
                    size="sm"
                    className={`flex-1 gap-1 ${
                      nextStatus === "COOKING"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    {nextStatus === "COOKING" ? "Bắt đầu nấu" : "Hoàn thành"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                {!previousStatus && !nextStatus && (
                  <div className="flex-1 text-center text-sm text-green-600 dark:text-green-400 font-semibold">
                    ✓ Đã hoàn thành
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
