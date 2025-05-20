import { getAllTables } from "@/apis/table.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import Paginate from "@/components/dev/PaginationCustom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { path } from "@/constants/path";
import useTableQueryConfig from "@/hooks/useTableQueryConfig";
import DialogTable from "@/pages/Manage/ManageTable/components/DialogTable";
import TableDataTable from "@/pages/Manage/ManageTable/components/TableDataTable";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function ManageTable() {
  const tableQueryConfig = useTableQueryConfig();
  const form = useForm({
    defaultValues: {
      tableNumber: "",
    },
  });

  const { data: tables } = useQuery({
    queryKey: ["tables", tableQueryConfig],
    queryFn: () => getAllTables(tableQueryConfig),
  });

  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((values) => {
    const tableNumber = values.tableNumber.trim();
    if (!tableNumber) return;
    navigate({
      pathname: path.manageTable,
      search: createSearchParams({
        ...tableQueryConfig,
        tableNumber,
      }).toString(),
    });
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold mb-1">Bàn ăn</p>
          <p className="text-sm italic">Quản lý bàn ăn</p>
        </div>
        <div>
          <DialogTable />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <InputCustom
                control={form.control}
                name="tableNumber"
                placeholder="Nhập số bàn để tìm kiếm"
              />
            </div>
            <Button className="col-span-1">Tìm kiếm</Button>
          </div>
        </form>
      </Form>
      <Separator className="my-2" />
      {tables?.data.data && (
        <TableDataTable tables={tables?.data.data.content} />
      )}
      <div>
        <Paginate
          path={path.manageTable}
          queryConfig={tableQueryConfig}
          pageSize={tables?.data.data.pagination.pageSize as number}
          totalSize={tables?.data.data.pagination.total as number}
        />
      </div>
    </div>
  );
}
