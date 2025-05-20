export interface ProductListConfig {
  page?: number;
  limit?: number;
  name?: string;
  categoryId?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: "createdAt" | "view" | "sold" | "price";
  order?: "asc" | "desc";
}

export interface UserListConfig {
  page?: number;
  limit?: number;
  email?: string;
}

export interface TableListConfig {
  page?: number;
  limit?: number;
  tableNumber?: number;
}
