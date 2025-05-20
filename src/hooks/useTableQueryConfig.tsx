import useQueryParams from "@/hooks/useQueryParams";
import { TableListConfig } from "@/types/params.type";
import { isUndefined, omitBy } from "lodash";

export type TableQueryConfig = {
  [key in keyof TableListConfig]: string;
};

export default function useTableQueryConfig() {
  const queryParams: TableQueryConfig =
    useQueryParams() as Partial<TableQueryConfig>;
  const tableQueryConfig = omitBy(
    {
      page: queryParams.page ?? "1",
      limit: queryParams.limit ?? "8",
      table_number: queryParams.tableNumber,
    },
    isUndefined
  );
  return tableQueryConfig;
}
