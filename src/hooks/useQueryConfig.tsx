import { sortBy } from "@/constants/sortBy";
import useQueryParams from "@/hooks/useQueryParams";
import { ProductListConfig } from "@/types/params.type";
import { isUndefined, omitBy } from "lodash";

export type QueryConfig = {
  [key in keyof ProductListConfig]: string;
};
export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page ?? "1",
      limit: queryParams.limit ?? "8",
      name: queryParams.name,
      status: queryParams.status,
      priceMin: queryParams.priceMin,
      priceMax: queryParams.priceMax,
      categoryId: queryParams.categoryId,
      sortBy: queryParams.sortBy ?? sortBy.createdAt,
      order: queryParams.order ?? "asc",
    },
    isUndefined
  );
  return queryConfig;
}
