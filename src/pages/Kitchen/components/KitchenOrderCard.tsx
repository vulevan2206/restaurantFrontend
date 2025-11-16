import { updateOrder } from "@/apis/order.api";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Order } from "@/types/order.type";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ChefHat, Clock, Users } from "lucide-react";

interface KitchenOrderCardProps {
  order: Order;
  onStatusUpdate: () => void;
}

export default function KitchenOrderCard({
  order,
  onStatusUpdate,
}: KitchenOrderCardProps) {
  const updateOrderMutation = useMutation({
    mutationFn: (newStatus: string) =>
      updateOrder({
        order_id: order._id,
        status: newStatus,
      }),
    onSuccess: () => {
      toast({
        title: "Cập nhật thành công",
        description: "Trạng thái đơn hàng đã được cập nhật",
      });
      onStatusUpdate();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái đơn hàng",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (newStatus: string) => {
    updateOrderMutation.mutate(newStatus);
  };

  const getNextStatus = () => {
    switch (order.status) {
      case "IN_PROGRESS":
        return { status: "COOKING", label: "Bắt đầu nấu", color: "bg-blue-500 hover:bg-blue-600" };
      case "COOKING":
        return { status: "SERVED", label: "Hoàn thành", color: "bg-green-500 hover:bg-green-600" };
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  const timeAgo = formatDistanceToNow(new Date(order.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-lg p-4 shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
      {/* Header with Table Number */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 dark:bg-slate-900 text-white px-3 py-1 rounded-md font-bold">
            Bàn {order.table_number}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300">
          <Clock className="w-3 h-3" />
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="mb-3">
        <div className="flex items-start gap-2">
          <ChefHat className="w-5 h-5 text-slate-600 dark:text-slate-300 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">
              {order.product?.name || "Sản phẩm không xác định"}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Số lượng: <span className="font-semibold text-lg">{order.buy_count}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-2 mb-4 text-sm text-slate-600 dark:text-slate-300">
        <Users className="w-4 h-4" />
        <span>{order.customer_name}</span>
      </div>

      {/* Action Button */}
      {nextStatus && (
        <Button
          onClick={() => handleStatusChange(nextStatus.status)}
          disabled={updateOrderMutation.isLoading}
          className={`w-full ${nextStatus.color} text-white font-semibold`}
        >
          {updateOrderMutation.isLoading ? "Đang xử lý..." : nextStatus.label}
        </Button>
      )}

      {order.status === "SERVED" && (
        <div className="text-center text-sm text-green-600 dark:text-green-400 font-semibold">
          Đã hoàn thành
        </div>
      )}
    </div>
  );
}
