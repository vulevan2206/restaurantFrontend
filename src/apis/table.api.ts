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

// Table Session APIs
export const checkTableSession = (table_number: number) =>
  http.get<
    SuccessResponse<{
      hasActiveSession: boolean;
      session: {
        table_number: number;
        customer_id: string;
        customer_name: string;
        is_active: boolean;
        logged_in_at: string;
        last_activity: string;
      } | null;
    }>
  >("tables/session/check", {
    params: {
      table_number,
    },
  });

export const createTableSession = (body: {
  table_number: number;
  customer_id: string;
  customer_name: string;
  token: string;
}) => http.post<SuccessResponse<any>>("tables/session/create", body);

export const unlockTableSession = (body: {
  table_number: number;
  customer_id?: string;
}) => http.post<SuccessResponse<string>>("tables/session/unlock", body);

export const updateSessionActivity = (customer_id: string) =>
  http.post<SuccessResponse<string>>("tables/session/activity", {
    customer_id,
  });
