import { User } from "@/types/user.type";

export interface SuccessResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface ErrorResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export interface PaginationResponse<T> {
  content: T;
  pagination: {
    page: number;
    limit: number;
    pageSize: number;
    total: number;
  };
}

export interface FormControlItem {
  value: string;
  label: string | React.ReactNode;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
