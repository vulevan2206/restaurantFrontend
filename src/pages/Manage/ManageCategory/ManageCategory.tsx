import { getAllCategories } from "@/apis/category.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { path } from "@/constants/path";
import useQueryParams from "@/hooks/useQueryParams";
import DialogCategory from "@/pages/Manage/ManageCategory/components/DialogCategory";
import DialogCreateNewCategory from "@/pages/Manage/ManageCategory/components/DialogCategory";
import DialogDeleteCategory from "@/pages/Manage/ManageCategory/components/DialogDeleteCategory";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function ManageCategory() {
  const params = useQueryParams();
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories", params],
    queryFn: () => getAllCategories(params),
  });

  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((values) => {
    const { name } = values;
    navigate({
      pathname: path.manageCategory,
      search: createSearchParams({
        name,
      }).toString(),
    });
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold mb-1">Danh mục</p>
          <p className="text-sm italic">Quản lý danh mục</p>
        </div>
        <div>
          <DialogCreateNewCategory />
        </div>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <InputCustom
                  control={form.control}
                  name="name"
                  placeholder="Nhập tên để tìm kiếm"
                />
              </div>
              <div className="col-span-2">
                <Button>Tìm kiếm</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <Separator className="my-2" />
      <div>
        <Table>
          <TableHeader>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead></TableHead>
          </TableHeader>
          <TableBody>
            {categories?.data.data.map((category) => (
              <TableRow key={category._id} className="font-semibold">
                <TableCell>{category._id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <DialogCategory category={category} />
                    <DialogDeleteCategory category={category} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
