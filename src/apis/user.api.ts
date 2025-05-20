import { UserQueryConfig } from "@/hooks/useUserQueryConfig";
import {
  ChangePassword,
  MeRequest,
  User,
  UserRequest,
} from "@/types/user.type";
import { PaginationResponse, SuccessResponse } from "@/types/utils.type";
import http from "@/utils/http";

export const getUsers = (params: UserQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<User[]>>>("users", {
    params,
  });

export const createUser = (body: UserRequest) =>
  http.post<SuccessResponse<string>>("users", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateUser = (id: string, body: UserRequest) =>
  http.patch<SuccessResponse<string>>(`users/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getMe = () => http.get<SuccessResponse<User>>("users/me");

export const updateMe = (body: MeRequest) =>
  http.patch<SuccessResponse<User>>("users/me", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateMyPassword = (body: ChangePassword) =>
  http.patch<SuccessResponse<User>>("users/me/password", body);
