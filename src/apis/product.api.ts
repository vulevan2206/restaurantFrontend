import { QueryConfig } from "@/hooks/useQueryConfig";
import { Product, ProductRequest } from "@/types/product.type";
import { PaginationResponse, SuccessResponse } from "@/types/utils.type";
import http from "@/utils/http";

export const getProducts = (params: QueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<Product[]>>>("products", {
    params,
  });

export const addProduct = (body: ProductRequest) =>
  http.post<SuccessResponse<string>>(`products`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateProduct = (id: string, body: ProductRequest) =>
  http.patch<SuccessResponse<string>>(`products/${id}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const increaseView = (id: string) =>
  http.patch<SuccessResponse<string>>(`products/${id}/increase-view`);
