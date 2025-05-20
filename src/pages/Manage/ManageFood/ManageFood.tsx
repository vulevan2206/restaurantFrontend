import { getAllCategories } from "@/apis/category.api";
import { getProducts } from "@/apis/product.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import SelectionCustom from "@/components/dev/Form/SelectionCustom";
import Paginate from "@/components/dev/PaginationCustom";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { path } from "@/constants/path";
import useQueryConfig from "@/hooks/useQueryConfig";
import DialogFood from "@/pages/Manage/ManageFood/components/DialogFood";
import FoodTable from "@/pages/Manage/ManageFood/components/FoodTable";
import { FormControlItem } from "@/types/utils.type";
import { useQuery } from "@tanstack/react-query";
import { isEmpty, omitBy } from "lodash";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function ManageFood() {
  const queryConfig = useQueryConfig();
  const form = useForm({
    defaultValues: {
      name: "",
      categoryId: "",
      status: "",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const { data: products } = useQuery({
    queryKey: ["products", queryConfig],
    queryFn: () => getProducts(queryConfig),
  });

  const categoriesSelectionData = useMemo(() => {
    return categories?.data.data.map((category) => ({
      label: category.name,
      value: category._id,
    }));
  }, [categories]);

  const statusSelectionData: FormControlItem[] = [
    {
      label: "Có sẵn",
      value: "AVAILABLE",
    },
    {
      label: "Đã khóa",
      value: "UNAVAILABLE",
    },
  ];

  const navigate = useNavigate();
  const categoryId = form.watch("categoryId");
  const status = form.watch("status");
  useEffect(() => {
    navigate({
      pathname: path.manageFood,
      search: createSearchParams(
        omitBy(
          {
            ...queryConfig,
            categoryId,
            status,
          },
          isEmpty
        )
      ).toString(),
    });
  }, [categoryId, status]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold mb-1">Món ăn</p>
          <p className="text-sm italic">Quản lý món ăn</p>
        </div>
        <div>
          <DialogFood />
        </div>
      </div>
      <div>
        <Form {...form}>
          <form>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <SelectionCustom
                  control={form.control}
                  name="categoryId"
                  data={categoriesSelectionData}
                  label="Danh mục"
                  placeholder="Danh mục"
                />
              </div>
              <div className="col-span-3">
                <SelectionCustom
                  control={form.control}
                  name="status"
                  data={statusSelectionData}
                  label="Trạng thái"
                  placeholder="Trạng thái"
                />
              </div>
              <div className="col-span-3">
                <InputCustom
                  control={form.control}
                  name="name"
                  placeholder="Nhập tên để tìm kiếm"
                  label="Tên món ăn"
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
      <Separator className="my-2" />
      {products?.data.data.content && (
        <FoodTable products={products?.data.data.content} />
      )}
      <div>
        <Paginate
          path={path.manageFood}
          queryConfig={queryConfig}
          pageSize={products?.data.data.pagination.pageSize as number}
          totalSize={products?.data.data.pagination.total as number}
        />
      </div>
    </div>
  );
}
