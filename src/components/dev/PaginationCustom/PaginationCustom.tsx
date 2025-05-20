import { createSearchParams, useNavigate } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface Props {
  readonly path: string;
  readonly pageSize: number;
  readonly totalSize: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly queryConfig: any;
}

export default function Paginate({ path, queryConfig, pageSize }: Props) {
  const navigate = useNavigate();
  const page = Number(queryConfig.page);

  const handleValueChange = (val: string) => {
    navigate({
      pathname: path,
      search: createSearchParams({
        ...queryConfig,
        page: "1",
        limit: val,
      }).toString(),
    });
  };

  return (
    <div className="flex items-center justify-between relative w-full mt-4">
      <p className="text-sm italic">
        Trang{" "}
        <strong>
          {page}/{pageSize}
        </strong>
      </p>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                to={{
                  pathname: path,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString(),
                  }).toString(),
                }}
                disabled={page === 1}
              />
            </PaginationItem>
            <div>{page}</div>
            <PaginationItem>
              <PaginationNext
                to={{
                  pathname: path,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString(),
                  }).toString(),
                }}
                disabled={page >= pageSize}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div>
        <Select
          defaultValue={queryConfig.limit}
          onValueChange={handleValueChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent className="!px-4">
            {Array(6)
              .fill(1)
              .map((item, index) => (
                <SelectItem key={index} value={String(item * (index + 1) * 8)}>
                  {item * (index + 1) * 8}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
