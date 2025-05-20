import { getProducts } from "@/apis/product.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import SelectionCustom from "@/components/dev/Form/SelectionCustom";
import PaginationCustom from "@/components/dev/PaginationCustom";
import ProductCard from "@/components/dev/ProductCard";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { path } from "@/constants/path";
import { sortBy } from "@/constants/sortBy";
import useQueryConfig from "@/hooks/useQueryConfig";
import AsideFilter from "@/pages/Menu/components/AsideFilter";
import { FilterSchema } from "@/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { FilterIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import * as yup from "yup";

const selectionOrderData = [
  {
    value: "asc",
    label: "Giá - thấp đến cao",
  },
  {
    value: "desc",
    label: "Giá - cao đến thấp",
  },
];

type FormData = yup.InferType<typeof FilterSchema>;

export default function Menu() {
  let queryConfig = useQueryConfig();
  queryConfig = {
    ...queryConfig,
    status: "AVAILABLE",
  };

  const form = useForm<FormData>({
    defaultValues: {
      name: queryConfig.name ?? "",
      order:
        queryConfig.sortBy === sortBy.price
          ? (queryConfig.order as string)
          : "",
    },
    resolver: yupResolver(FilterSchema),
  });

  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((values) => {
    const name = values?.name?.trim();
    if (!name) return;
    navigate({
      pathname: path.menu,
      search: createSearchParams({
        ...queryConfig,
        name,
      }).toString(),
    });
  });

  const { data: products } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => getProducts(queryConfig),
  });

  const orderPrice = form.watch("order");
  useEffect(() => {
    if (!orderPrice) return;
    navigate({
      pathname: path.menu,
      search: createSearchParams({
        ...queryConfig,
        sortBy: sortBy.price,
        order: orderPrice,
      }).toString(),
    });
  }, [orderPrice]);

  return (
    <div className="flex py-6">
      <div className="fixed top-1/2 left-4 lg:hidden z-50 p-1 rounded-md shadow-md bg-background text-foreground flex items-center justify-center">
        <Sheet>
          <SheetTrigger>
            <FilterIcon />
          </SheetTrigger>
          <SheetContent className="h-[100vh] overflow-y-auto" side="left">
            <AsideFilter queryConfig={queryConfig} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="w-[300px] hidden lg:block">
        <AsideFilter queryConfig={queryConfig} />
      </div>
      <div className="flex-1 px-6">
        <div className="w-full">
          <Form {...form}>
            <div className="flex flex-col lg:flex-row space-y-1 justify-between">
              <div className="flex items-center">
                <Link
                  to={{
                    pathname: path.menu,
                    search: createSearchParams({
                      ...queryConfig,
                      order: "desc",
                      sortBy: sortBy.createdAt,
                    }).toString(),
                  }}
                  className={clsx(
                    "mr-3 px-3 py-2 rounded-md flex items-center justify-center text-sm",
                    {
                      "bg-primary text-primary-foreground":
                        queryConfig.sortBy === sortBy.createdAt,
                      border: queryConfig.sortBy !== sortBy.createdAt,
                    }
                  )}
                >
                  Mới nhất
                </Link>
                <Link
                  to={{
                    pathname: path.menu,
                    search: createSearchParams({
                      ...queryConfig,
                      order: "desc",
                      sortBy: sortBy.sold,
                    }).toString(),
                  }}
                  className={clsx(
                    "mr-3 px-3 py-2 rounded-md flex items-center justify-center text-sm",
                    {
                      "bg-primary text-primary-foreground":
                        queryConfig.sortBy === sortBy.sold,
                      border: queryConfig.sortBy !== sortBy.sold,
                    }
                  )}
                >
                  Bán chạy nhất
                </Link>
                <Link
                  to={{
                    pathname: path.menu,
                    search: createSearchParams({
                      ...queryConfig,
                      order: "desc",
                      sortBy: sortBy.view,
                    }).toString(),
                  }}
                  className={clsx(
                    "mr-3 px-3 py-2 rounded-md flex items-center justify-center text-sm  ",
                    {
                      "bg-primary text-primary-foreground":
                        queryConfig.sortBy === sortBy.view,
                      border: queryConfig.sortBy !== sortBy.view,
                    }
                  )}
                >
                  Xem nhiều nhất
                </Link>
                <SelectionCustom
                  control={form.control}
                  name="order"
                  data={selectionOrderData}
                  placeholder="Giá"
                />
              </div>
              <div className="w-full lg:w-1/3">
                <form onSubmit={onSubmit}>
                  <div className="flex items-center">
                    <InputCustom
                      control={form.control}
                      name="name"
                      placeholder="Nhập tên sản phẩm để tìm kiếm"
                      className="mb-0 flex-1 mr-2"
                    />
                    <Button>Tìm kiếm</Button>
                  </div>
                </form>
              </div>
            </div>
          </Form>
          <Separator className="my-4" />
          <div className="grid grid-cols-12 gap-4">
            {products?.data.data.content.map((product) => (
              <div
                key={product._id}
                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <PaginationCustom
          path={path.menu}
          queryConfig={queryConfig}
          pageSize={products?.data.data.pagination.pageSize as number}
          totalSize={products?.data.data.pagination.total as number}
        />
      </div>
    </div>
  );
}
