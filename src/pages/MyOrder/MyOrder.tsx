import { createMomoPaymentCard, createMomoPaymentQR, getUserOrder } from "@/apis/order.api";
import { Badge } from "@/components/ui/badge";
import { orderStatus } from "@/constants/orderStatus";
import { AppContext } from "@/contexts/app.context";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { io } from "socket.io-client";
import { BASE_SOCKET_URL } from "@/constants/config";
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

  // useEffect(() => {
  //   const socket = io(BASE_SOCKET_URL);
  
  //   socket.emit("registerUser", customerId);
  
  //   socket.on("orderUpdated", (data) => {
  //     toast({ description: data.message });
  //     refetch();
  //   });
  
  //   return () => socket.disconnect();
  // }, [customerId, refetch]);
  

  const socket = io(BASE_SOCKET_URL);
  socket.emit("registerUser", customerId);
  socket.on("orderUpdated", (data) => {
    toast({
      description: data.message,
    });
    refetch();
  });

  
  const totalAmount =
  orders?.data?.data?.reduce(
    (sum, order) => sum + order.product.price * order.buy_count,
    0
  ) ?? 0;


  
  const handleTotalMomoPayment = async () => {
    if (!totalAmount) return;
  
    try {
      const payload = {
        partnerCode: "MOMO",
        accessKey: "F8BBA842ECF85",
        secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
        amount: totalAmount.toString(),
        orderId: `total-order-${customerId}-${Date.now()}`,
        orderInfo: `Thanh toán tổng hóa đơn`,
        redirectUrl: "https://your-domain.com/payment-success",
        ipnUrl: "https://your-domain.com/payment-ipn",
        extraData: "",
      };
  
      const res = await createMomoPaymentQR(payload);
      const payUrl = res.data?.data?.payUrl;
  
      if (payUrl) {
        window.open(payUrl, "_blank"); // open MoMo QR
      }
    } catch (error) {
      console.error(error);
      toast({ description: "Lỗi tạo thanh toán MoMo" });
    }
  };
  
  const handleCardPayment = async () => {
    if (!totalAmount) return;
  
    try {
      const payload = {
        partnerCode: "MOMO",
        accessKey: "F8BBA842ECF85",
        secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
        amount: totalAmount.toString(),
        orderId: `card-order-${customerId}-${Date.now()}`,
        orderInfo: `Thanh toán qua thẻ (MoMo)`,
        redirectUrl: "http://localhost:3001/my-order",
        ipnUrl: "https://your-domain.com/payment-ipn",
        extraData: "",
        requestType: "payWithATM"   
      };
  
      const res = await createMomoPaymentCard(payload);
      const payUrl = res.data?.data?.payUrl;
  
      if (payUrl) {
        window.open(payUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast({ description: "Lỗi tạo thanh toán thẻ MoMo" });
    }
  };

  
  
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
            {(orders?.data?.data?.length ?? 0) > 0 && (
            <div className="text-center mt-6">
              <p className="text-xl font-bold mb-2">
                Tổng tiền: {formatCurrency(totalAmount)}đ
              </p>

              <button
                onClick={handleTotalMomoPayment}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700"
              >
                Thanh toán MoMo
              </button>

              <button
                onClick={handleCardPayment}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 mt-3"
              >
                Thanh toán bằng thẻ (MoMo)
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}


// tao order tu day