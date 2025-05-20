import { Product } from "@/types/product.type";
import { User } from "@/types/user.type";

export interface OrderRequest {
  table_number: number | string;
  customer_name: string;
  customer_id: string;
  products: { id: string; buy_count: number }[];
  assignee: string;
}

export type OrderStatusType =
  | "IN_PROGRESS"
  | "COOKING"
  | "REJECTED"
  | "SERVED"
  | "PAID";

export interface Order {
  _id: string;
  table_number: number;
  customer_name: string;
  customer_id: string;
  assignee?: User;
  product: Product;
  buy_count: number;
  status: OrderStatusType;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListConfig {
  page?: number;
  limit?: number;
  tableNumber?: number;
  customerName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderUpdateRequest {
  order_id: string;
  product_id?: string;
  buy_count?: string;
  status?: string;
  assignee?: string;
}

export interface TableStatistic {
  tableNumber: number;
  cntInprogressOrder: number;
  cntCookingOrder: number;
  cntRejectedOrder: number;
  cntServedOrder: number;
  cntPaidOrder: number;
}

export interface OrderStatistic {
  tables: TableStatistic[];
  orders: Order[];
  cntInprogressOrder: number;
  cntCookingOrder: number;
  cntRejectedOrder: number;
  cntServedOrder: number;
  cntPaidOrder: number;
}

export interface Customer {
  table_number: number;
  customer_name: string;
  customer_id: string;
}
