import { getStatistics, getStatisticsTable } from "@/apis/order.api";
import DatePicker from "@/components/dev/DatePicker";
import InputCustom from "@/components/dev/Form/InputCustom";
import SelectionCustom from "@/components/dev/Form/SelectionCustom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { orderStatus } from "@/constants/orderStatus";
import { path } from "@/constants/path";
import useOrderQueryConfig from "@/hooks/useOrderQueryConfig";
import CountOfOrderStatus from "@/pages/Manage/ManageOrder/components/CountOfOrderStatus";
import DialogCreateNewOrder from "@/pages/Manage/ManageOrder/components/DialogCreateNewOrder";
import OrderTable from "@/pages/Manage/ManageOrder/components/OrderTable";
import TableInformation from "@/pages/Manage/ManageOrder/components/TableInformation";
import { OrderStatusType } from "@/types/order.type";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createSearchParams,
  URLSearchParamsInit,
  useNavigate,
} from "react-router-dom";
import PaginationCustom from "@/components/dev/PaginationCustom";
import { io } from "socket.io-client";
import { toast } from "@/hooks/use-toast";
import { isUndefined, omitBy } from "lodash";

export default function ManageOrder() {
  const orderQueryConfig = useOrderQueryConfig();
  const form = useForm({
    defaultValues: {
      customer_name: "",
      table_number: "",
      status: "",
    },
  });

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const statusSelectionData = useMemo(
    () =>
      Array.from(Object.keys(orderStatus)).map((item) => ({
        value: item,
        label: orderStatus[item as OrderStatusType],
      })),
    []
  );

  const { data: ordersStatistics, refetch: refetchOrdersStatistics } = useQuery(
    {
      queryKey: ["order-statistics", orderQueryConfig],
      queryFn: () => getStatistics(orderQueryConfig),
    }
  );

  const { data: statisticsTable, refetch: refetchStatisticsTable } = useQuery({
    queryKey: ["order-statistics-table"],
    queryFn: getStatisticsTable,
  });

  const navigate = useNavigate();

  const onSubmit = form.handleSubmit(
    useCallback(
      (values) => {
        navigate({
          pathname: path.manageOrder,
          search: createSearchParams({
            ...orderQueryConfig,
            customerName: values.customer_name,
            tableNumber: values.table_number,
          }).toString(),
        });
      },
      [navigate, orderQueryConfig]
    )
  );

  const handleReset = () => {
    navigate(path.manageOrder);
    form.reset({
      customer_name: "",
      table_number: "",
      status: "",
    });
  };

  const status = form.watch("status");
  useEffect(() => {
    if (!status) return;
    navigate({
      pathname: path.manageOrder,
      search: createSearchParams({
        ...orderQueryConfig,
        status,
      }).toString(),
    });
  }, [status]);

  useEffect(() => {
    navigate({
      pathname: path.manageOrder,
      search: createSearchParams(
        omitBy(
          {
            ...orderQueryConfig,
            startDate,
            endDate,
          },
          isUndefined
        ) as unknown as URLSearchParamsInit | undefined
      ).toString(),
    });
  }, [startDate, endDate]);

  const socket = io("http://localhost:8080");
  socket.on("connect", () => {
    console.log("Connected to server: " + socket.id);
  });
  socket.on("addOrder", (data) => {
    toast({
      description: data.message,
    });
    refetchOrdersStatistics();
    refetchStatisticsTable();
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold mb-1">Đơn hàng</p>
          <p className="text-sm italic">Quản lý đơn hàng</p>
        </div>
        <div>
          <DialogCreateNewOrder />
        </div>
      </div>
      <div className="w-2/3 grid grid-cols-3 gap-4 mb-4">
        <DatePicker date={startDate} setDate={setStartDate} placeholder="Từ" />
        <DatePicker date={endDate} setDate={setEndDate} placeholder="Đến" />
        <div>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="w-2/3 grid grid-cols-4 gap-4">
              <InputCustom
                control={form.control}
                name="customer_name"
                placeholder="Tên khách"
              />
              <InputCustom
                control={form.control}
                name="table_number"
                placeholder="Số bàn"
              />
              <SelectionCustom
                control={form.control}
                name="status"
                placeholder="Trạng thái"
                data={statusSelectionData}
              />
              <Button>Tìm kiếm</Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex items-center gap-4 mb-4">
        {statisticsTable?.data.data.map((table) => (
          <div key={table.tableNumber} className="w-[10%]">
            <TableInformation tableStatistic={table} />
          </div>
        ))}
      </div>
      <CountOfOrderStatus ordersStatistics={ordersStatistics} />
      <Separator className="my-4" />
      <div>
        <OrderTable orders={ordersStatistics?.data.data.content.orders} />
      </div>
      <PaginationCustom
        pageSize={ordersStatistics?.data.data.pagination.pageSize as number}
        path={path.manageOrder}
        queryConfig={orderQueryConfig}
        totalSize={ordersStatistics?.data.data.pagination.total as number}
      />
    </div>
  );
}
