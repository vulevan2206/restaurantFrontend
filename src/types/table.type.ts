export type TableStatus = "BOOKED" | "NOT_BOOKED";

export interface Table {
  _id: string;
  table_number: number;
  capacity: number;
  current: number;
  token: string;
  status: TableStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TableRequest {
  table_number: number;
  capacity: number;
  token: string;
  status: string;
}
