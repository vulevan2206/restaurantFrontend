import useQueryParams from "@/hooks/useQueryParams";

import { UserListConfig } from "@/types/params.type";
import { isUndefined, omitBy } from "lodash";

export type UserQueryConfig = {
  [key in keyof UserListConfig]: string;
};
export default function useUserQueryConfig() {
  const queryParams: UserQueryConfig = useQueryParams();
  const queryConfig: UserQueryConfig = omitBy(
    {
      page: queryParams.page ?? "1",
      limit: queryParams.limit ?? "8",
      email: queryParams.email,
    },
    isUndefined
  );
  return queryConfig;
}
