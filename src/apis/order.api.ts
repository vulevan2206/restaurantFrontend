import { OrderQueryConfig } from "@/hooks/useOrderQueryConfig";
import {
  Customer,
  Order,
  OrderRequest,
  OrderStatistic,
  OrderUpdateRequest,
  TableStatistic,
} from "@/types/order.type";
import { PaginationResponse, SuccessResponse } from "@/types/utils.type";
import http from "@/utils/http";

export const addOrder = (body: OrderRequest) =>
  http.post<SuccessResponse<string>>("orders", body);

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
