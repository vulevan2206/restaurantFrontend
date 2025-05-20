import { TableQueryConfig } from "@/hooks/useTableQueryConfig";
import { Table, TableRequest } from "@/types/table.type";
import { PaginationResponse, SuccessResponse } from "@/types/utils.type";
import http from "@/utils/http";

export const checkAvailableTable = (params: {
  table_number: string;
  token: string;
}) =>
  http.post<SuccessResponse<string>>("tables/check-available-table", null, {
    params,
  });

export const getAllTables = (params: TableQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Table[]>>>("tables", {
    params,
  });

export const addTable = (body: TableRequest) =>
  http.post<SuccessResponse<string>>("tables", body);

export const updateTable = (id: string, body: TableRequest) =>
  http.patch<SuccessResponse<Table>>(`tables/${id}`, body);

export const deleteTable = (id: string) =>
  http.delete<SuccessResponse<string>>(`tables/${id}`);

export const leaveTable = (table_number: number) =>
  http.post<SuccessResponse<string>>(`tables/leave`, null, {
    params: {
      table_number,
    },
  });
