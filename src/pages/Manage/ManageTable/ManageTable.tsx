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
import { Table } from "@/types/table.type";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function ManageTable() {
  const tableQueryConfig = useTableQueryConfig();
  const form = useForm({
    defaultValues: {
      tableNumber: "",
      capacity: "",
    },
  });

  const { data: tables } = useQuery({
    queryKey: ["tables", tableQueryConfig],
    queryFn: () => getAllTables(tableQueryConfig),
  });

  const navigate = useNavigate();

  // Filter và sort bàn theo capacity ở frontend
  const filteredTables = useMemo(() => {
    if (!tables?.data.data.content) return [];

    let result = [...tables.data.data.content];

    // Nếu có filter theo capacity
    const searchCapacity = tableQueryConfig.capacity;
    if (searchCapacity) {
      const numCapacity = parseInt(searchCapacity);
      const maxCapacity = numCapacity + 4; // Cho phép bàn lớn hơn tối đa 4 chỗ

      result = result.filter((table: Table) =>
        table.capacity >= numCapacity && table.capacity <= maxCapacity
      );

      // Sắp xếp theo capacity tăng dần (bàn nhỏ lên trước)
      result.sort((a: Table, b: Table) => a.capacity - b.capacity);
    }

    return result;
  }, [tables, tableQueryConfig.capacity]);

  const onSubmit = form.handleSubmit((values) => {
    const tableNumber = values.tableNumber.trim();
    const capacity = values.capacity.trim();

    const params: any = { ...tableQueryConfig };

    if (tableNumber) {
      params.tableNumber = tableNumber;
    }

    if (capacity) {
      params.capacity = capacity;
    }

    navigate({
      pathname: path.manageTable,
      search: createSearchParams(params).toString(),
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
            <div className="col-span-3">
              <InputCustom
                control={form.control}
                name="tableNumber"
                placeholder="Nhập số bàn để tìm kiếm"
              />
            </div>
            <div className="col-span-3">
              <InputCustom
                control={form.control}
                name="capacity"
                placeholder="Số người (vd: 4)"
                type="number"
              />
            </div>
            <Button className="col-span-1">Tìm kiếm</Button>
          </div>
        </form>
      </Form>
      <Separator className="my-2" />
      {tables?.data.data && (
        <TableDataTable tables={filteredTables} />
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
