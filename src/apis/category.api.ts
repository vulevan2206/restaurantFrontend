import { Category } from "@/types/category.type";
import { SuccessResponse } from "@/types/utils.type";
import http from "@/utils/http";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllCategories = (params?: any) =>
  http.get<SuccessResponse<Category[]>>("/categories", {
    params,
  });

export const createCategory = (body: { name: string }) =>
  http.post<SuccessResponse<string>>("/categories", body);

export const updateCategory = (id: string, body: { name: string }) =>
  http.patch<SuccessResponse<string>>(`/categories/${id}`, body);

export const deleteCategory = (id: string) =>
  http.delete<SuccessResponse<string>>(`/categories/${id}`);
