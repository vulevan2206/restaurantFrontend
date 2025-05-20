import useQueryParams from "@/hooks/useQueryParams";
import { OrderListConfig } from "@/types/order.type";
import { isUndefined, omitBy } from "lodash";

export type OrderQueryConfig = {
  [key in keyof OrderListConfig]: string;
};

export default function useOrderQueryConfig() {
  const queryParams: OrderQueryConfig =
    useQueryParams() as Partial<OrderQueryConfig>;
  const orderQueryConfig = omitBy(
    {
      page: queryParams.page ?? "1",
      limit: queryParams.limit ?? "8",
      customer_name: queryParams.customerName,
      table_number: queryParams.tableNumber,
      status: queryParams.status,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
    },
    isUndefined
  );
  return orderQueryConfig;
}
