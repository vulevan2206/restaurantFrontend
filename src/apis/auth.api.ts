import { AuthResponse, SuccessResponse } from "@/types/utils.type";
import http from "@/utils/http";

export const login = (body: { email: string; password: string }) =>
  http.post<SuccessResponse<AuthResponse>>("auth/login", body);
