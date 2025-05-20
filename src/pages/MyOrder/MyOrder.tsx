import { getUserOrder } from "@/apis/order.api";
import { Badge } from "@/components/ui/badge";
import { orderStatus } from "@/constants/orderStatus";
import { AppContext } from "@/contexts/app.context";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { io } from "socket.io-client";

export default function MyOrder() {
  const { customerName, customerId, tableNumber } = useContext(AppContext);
  const params = {
    customer_name: customerName,
    customer_id: customerId,
    table_number: tableNumber,
  };

  const { data: orders, refetch } = useQuery({
    queryKey: ["user-orders", params],
    queryFn: () => getUserOrder(params),
  });

  const socket = io("http://localhost:8080");
  socket.emit("registerUser", customerId);
  socket.on("orderUpdated", (data) => {
    toast({
      description: data.message,
    });
    refetch();
  });
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 shadow-md rounded-lg p-6 mt-6 border ">
            <h1 className="text-2xl text-center font-bold mb-6">
              Đơn hàng của tôi
            </h1>
            {orders?.data.data.map((order) => (
              <div
                key={order.customer_id}
                className="flex flex-col items-start justify-start space-y-1 lg:flex-row lg:items-center lg:justify-between border-b py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-20 h-20 object-cover rounded-md shadow"
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">
                      {order.product.name}{" "}
                      <span className="text-gray-500">x{order.buy_count}</span>
                    </p>
                    <p className="font-medium text-xl text-red-700">
                      {formatCurrency(order.product.price)}đ
                    </p>
                  </div>
                </div>
                <div>
                  <Badge>{orderStatus[order.status] || "Không xác định"}</Badge>
                </div>
              </div>
            ))}
            {(!orders || orders.data.data.length === 0) && (
              <p className="text-center mt-4">Không có đơn hàng nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
