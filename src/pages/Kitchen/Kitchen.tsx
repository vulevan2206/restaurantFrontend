import { getStatistics } from "@/apis/order.api";
import { BASE_SOCKET_URL } from "@/constants/config";
import { toast } from "@/hooks/use-toast";
import TableOrderGroup from "@/pages/Kitchen/components/TableOrderGroup";
import { Order } from "@/types/order.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useCallback } from "react";
import { io } from "socket.io-client";

interface GroupedOrders {
  [tableNumber: number]: Order[];
}

export default function Kitchen() {
  const queryClient = useQueryClient();

  // Kitchen-specific config: fetch ALL orders (limit 999), no filters
  const kitchenQueryConfig = useMemo(() => ({
    page: "1",
    limit: "999", // Fetch all orders
  }), []);

  const { data: ordersStatistics, refetch: refetchOrdersStatistics } = useQuery(
    {
      queryKey: ["kitchen-orders", kitchenQueryConfig],
      queryFn: () => getStatistics(kitchenQueryConfig),
      refetchInterval: 5000, // Auto-refresh every 5 seconds (reduced from 10)
    }
  );

  // Stable refetch function
  const handleRefetch = useCallback(() => {
    refetchOrdersStatistics();
    queryClient.invalidateQueries({ queryKey: ["kitchen-orders"] });
  }, [refetchOrdersStatistics, queryClient]);

  useEffect(() => {
    const socket = io(BASE_SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Kitchen connected to server: " + socket.id);
    });

    socket.on("addOrder", (data) => {
      console.log("New order received:", data);
      toast({
        title: "🔔 Đơn hàng mới!",
        description: data.message,
      });
      handleRefetch();
    });

    socket.on("orderStatusUpdated", (data) => {
      console.log("Order status updated:", data);
      handleRefetch();
    });

    socket.on("disconnect", () => {
      console.log("Kitchen disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("addOrder");
      socket.off("orderStatusUpdated");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [handleRefetch]);

  const orders = ordersStatistics?.data.data.content.orders || [];

  // Group orders by table_number and status
  const groupOrdersByTableAndStatus = (
    orderList: Order[],
    status: string
  ): GroupedOrders => {
    return orderList
      .filter((order) => order.status === status)
      .reduce((acc: GroupedOrders, order) => {
        const tableNum = order.table_number;
        if (!acc[tableNum]) {
          acc[tableNum] = [];
        }
        acc[tableNum].push(order);
        return acc;
      }, {});
  };

  const inProgressTables = groupOrdersByTableAndStatus(orders, "IN_PROGRESS");
  const cookingTables = groupOrdersByTableAndStatus(orders, "COOKING");
  const servedTables = groupOrdersByTableAndStatus(orders, "SERVED");

  // Count total orders for stats
  const inProgressCount = Object.values(inProgressTables).flat().length;
  const cookingCount = Object.values(cookingTables).flat().length;
  const servedCount = Object.values(servedTables).flat().length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <p className="text-lg font-bold mb-1">Màn hình Bếp</p>
        <p className="text-sm italic">Quản lý đơn hàng theo thời gian thực</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-amber-500 text-white rounded-lg p-4 shadow-lg">
          <p className="text-sm font-semibold opacity-90">Đang xử lý</p>
          <p className="text-3xl font-bold">{inProgressCount}</p>
          <p className="text-xs opacity-75 mt-1">{Object.keys(inProgressTables).length} bàn</p>
        </div>
        <div className="bg-blue-500 text-white rounded-lg p-4 shadow-lg">
          <p className="text-sm font-semibold opacity-90">Đang nấu</p>
          <p className="text-3xl font-bold">{cookingCount}</p>
          <p className="text-xs opacity-75 mt-1">{Object.keys(cookingTables).length} bàn</p>
        </div>
        <div className="bg-green-500 text-white rounded-lg p-4 shadow-lg">
          <p className="text-sm font-semibold opacity-90">Đã phục vụ</p>
          <p className="text-3xl font-bold">{servedCount}</p>
          <p className="text-xs opacity-75 mt-1">{Object.keys(servedTables).length} bàn</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6">
        {/* Column 1: In Progress */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-amber-500">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Đang xử lý
            </h2>
            <span className="ml-auto bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-sm font-semibold px-2 py-1 rounded-full">
              {inProgressCount} món
            </span>
          </div>
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {Object.keys(inProgressTables).length === 0 ? (
              <p className="text-center text-slate-400 py-8">Không có đơn hàng</p>
            ) : (
              Object.entries(inProgressTables)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([tableNumber, tableOrders]) => (
                  <TableOrderGroup
                    key={`in-progress-${tableNumber}`}
                    tableNumber={Number(tableNumber)}
                    orders={tableOrders}
                    onStatusUpdate={handleRefetch}
                  />
                ))
            )}
          </div>
        </div>

        {/* Column 2: Cooking */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-500">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Đang nấu
            </h2>
            <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold px-2 py-1 rounded-full">
              {cookingCount} món
            </span>
          </div>
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {Object.keys(cookingTables).length === 0 ? (
              <p className="text-center text-slate-400 py-8">Không có đơn hàng</p>
            ) : (
              Object.entries(cookingTables)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([tableNumber, tableOrders]) => (
                  <TableOrderGroup
                    key={`cooking-${tableNumber}`}
                    tableNumber={Number(tableNumber)}
                    orders={tableOrders}
                    onStatusUpdate={handleRefetch}
                  />
                ))
            )}
          </div>
        </div>

        {/* Column 3: Served */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-green-500">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Đã phục vụ
            </h2>
            <span className="ml-auto bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-semibold px-2 py-1 rounded-full">
              {servedCount} món
            </span>
          </div>
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {Object.keys(servedTables).length === 0 ? (
              <p className="text-center text-slate-400 py-8">Không có đơn hàng</p>
            ) : (
              Object.entries(servedTables)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([tableNumber, tableOrders]) => (
                  <TableOrderGroup
                    key={`served-${tableNumber}`}
                    tableNumber={Number(tableNumber)}
                    orders={tableOrders}
                    onStatusUpdate={handleRefetch}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
