import { getAllCategories } from "@/apis/category.api";
import { path } from "@/constants/path";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PriceSchema } from "@/utils/rules";
import { Form } from "@/components/ui/form";
import InputCustom from "@/components/dev/Form/InputCustom";
import { Button } from "@/components/ui/button";
import { QueryConfig } from "@/hooks/useQueryConfig";
import clsx from "clsx";
import { useEffect } from "react";

type FormData = yup.InferType<typeof PriceSchema>;

interface Props {
  readonly queryConfig: QueryConfig;
}

export default function AsideFilter({ queryConfig }: Props) {
  const form = useForm<FormData>({
    defaultValues: {
      priceMin: queryConfig.priceMin ?? "",
      priceMax: queryConfig.priceMax ?? "",
    },
    resolver: yupResolver(PriceSchema),
  });

  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const onSubmit = form.handleSubmit((values) => {
    navigate({
      pathname: path.menu,
      search: createSearchParams({
        ...queryConfig,
        priceMax: values.priceMax as string,
        priceMin: values.priceMin as string,
      }).toString(),
    });
  });

  useEffect(() => {
    form.reset({
      priceMin: queryConfig.priceMin ?? "",
      priceMax: queryConfig.priceMax ?? "",
    });
  }, [queryConfig]);

  return (
    <div className="px-6 py-4 shadow-md rounded-md">
      <div className="mb-6">
        <p className="font-bold text-xl mb-2">Danh mục sản phẩm</p>
        <ul className="space-y-2">
          {categories?.data.data.map((category) => (
            <li
              key={category._id}
              className={clsx(
                "hover:bg-primary hover:text-primary-foreground rounded-md text-sm font-semibold",
                {
                  "hover:bg-primary hover:text-primary-foreground":
                    queryConfig.categoryId !== category._id,
                  "bg-primary text-primary-foreground":
                    queryConfig.categoryId === category._id,
                }
              )}
            >
              <Link
                to={{
                  pathname: path.menu,
                  search: createSearchParams({
                    ...queryConfig,
                    categoryId: category._id,
                  }).toString(),
                }}
                className="block px-3 py-2 transition-colors duration-75"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-bold text-xl mb-3">Giá cả</p>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <InputCustom
              control={form.control}
              name="priceMin"
              placeholder="Từ"
              label="Giá tối thiểu"
            />
            <InputCustom
              control={form.control}
              name="priceMax"
              placeholder="Đến"
              label="Giá tối đa"
            />
            <Button className="w-full ">Tìm kiếm</Button>
          </form>
        </Form>
      </div>
      <Link to={path.menu}>
        <Button className="w-full mt-3">Reset</Button>
      </Link>
    </div>
  );
}
