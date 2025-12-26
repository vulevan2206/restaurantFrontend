import { OrderQueryConfig } from "@/hooks/useOrderQueryConfig";
import {
  Customer,
  Order,
  OrderRequest,
  OrderStatistic,
  OrderUpdateRequest,
  StatisticsOrderByTableResponse,
  TableStatistic,
} from "@/types/order.type";
import { MomoPaymentParams } from "@/types/payment.type";
import { PaginationResponse, SuccessResponse } from "@/types/utils.type";
import http from "@/utils/http";

export const addOrder = (body: OrderRequest) =>
  http.post<SuccessResponse<string>>("orders", body);


export const createMomoPaymentQR = (body: MomoPaymentParams) =>
  http.post<SuccessResponse<{ payUrl: string }>>(
    "orders/payment/momo/create-qr",
    body
  );

<<<<<<< HEAD
  export const createMomoPaymentCard = async (body: MomoPaymentParams) => {
    return await http.post("orders/payment/momo/create-card", body);
  };
  

=======
>>>>>>> origin
export const getUserOrder = (params: {
  customer_id: string;
  customer_name: string;
  table_number: string;
}) =>
  http.get<SuccessResponse<Order[]>>("orders", {
    params,
  });

export const getStatistics = (params: OrderQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<OrderStatistic>>>(
    "orders/statistics",
    {
      params,
    }
  );

export const getStatisticsTable = () =>
  http.get<SuccessResponse<TableStatistic[]>>("orders/statistics-table");

export const updateOrder = (params: OrderUpdateRequest) =>
  http.patch(`orders/${params.order_id}`, {
    product_id: params.product_id,
    buy_count: params.buy_count,
    status: params.status,
    assignee: params.assignee,
  });

export const deleteOrder = (id: string) =>
  http.delete<SuccessResponse<string>>(`orders/${id}`);

export const findCustomer = (customer_id: string) =>
  http.get<SuccessResponse<Customer>>("orders/customer", {
    params: {
      customer_id,
    },
  });

export const getStatisticsOrderByTable = (params: OrderQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<StatisticsOrderByTableResponse>>>(
    "orders/statistics-order-by-table", 
    { params }
  );
