import { addTable, updateTable } from "@/apis/table.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import SelectionCustom from "@/components/dev/Form/SelectionCustom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import useTableQueryConfig from "@/hooks/useTableQueryConfig";
import { Table, TableRequest } from "@/types/table.type";
import { AddTableSchema } from "@/utils/rules";
import { generateQRCode, generateTableToken } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon, RefreshCcwIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = yup.InferType<typeof AddTableSchema>;

interface Props {
  readonly table?: Table;
}

export default function DialogTable({ table }: Props) {
  const tableQueryConfig = useTableQueryConfig();
  const isUpdate = !!table;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const isFormReset = useRef<boolean>(!isUpdate);
  const form = useForm<FormData>({
    defaultValues: {
      tableNumber: "",
      capacity: "",
      token: generateTableToken(),
      status: "",
    },
    resolver: yupResolver(AddTableSchema),
  });

  const handleRefreshToken = () => {
    form.setValue("token", generateTableToken());
  };

  const handleAfterSuccess = (message: string) => {
    toast({
      description: message,
    });
    queryClient.invalidateQueries({
      queryKey: ["tables", tableQueryConfig],
    });
    setOpen(false);
    form.reset({
      capacity: "",
      tableNumber: "",
      token: "",
      status: "NOT_BOOKED",
    });
  };

  const addTableMutation = useMutation({
    mutationFn: (body: TableRequest) => addTable(body),
    onSuccess: (res) => {
      handleAfterSuccess(res.data.message);
    },
  });

  const updateTableMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: TableRequest }) =>
      updateTable(id, body),
    onSuccess: (res) => {
      handleAfterSuccess(res.data.message);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    const payload: TableRequest = {
      table_number: parseInt(values.tableNumber),
      capacity: parseInt(values.capacity),
      token: values.token,
      status: values.status as string,
    };
    if (isUpdate) {
      updateTableMutation.mutate({
        id: table._id,
        body: payload,
      });
      return;
    }
    addTableMutation.mutate(payload);
  });

  useEffect(() => {
    if (!table) return;
    form.reset({
      capacity: String(table.capacity),
      tableNumber: String(table.table_number),
      token: table.token,
      status: table.status,
    });
    console.log(form.watch());

    isFormReset.current = true;
  }, [table]);

  const dataTableStatusSelection = [
    {
      value: "BOOKED",
      label: "Đã đặt",
    },
    {
      value: "NOT_BOOKED",
      label: "Có sẵn",
    },
  ];

  const url = `http://localhost:3001/table/${form.watch("tableNumber")}?token=${form.watch("token")}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isUpdate ? (
          <EditIcon className="size-4" />
        ) : (
          <Button className="w-full max-w-full">
            <PlusIcon />
            <span>Thêm bàn ăn</span>
          </Button>
        )}
      </DialogTrigger>
      {isFormReset.current && (
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isUpdate ? "Chỉnh sửa bàn ăn" : "Thêm bàn ăn mới"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">Số bàn</div>
                <div className="col-span-3">
                  <InputCustom
                    disabled={isUpdate}
                    control={form.control}
                    name="tableNumber"
                    placeholder="Nhập số bàn"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">Sức chứa</div>
                <div className="col-span-3">
                  <InputCustom
                    control={form.control}
                    name="capacity"
                    placeholder="Nhập sức chứa"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-1">Trạng thái</div>
                <div className="col-span-3">
                  <SelectionCustom
                    control={form.control}
                    name="status"
                    data={dataTableStatusSelection}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-1">Token</div>
                <div className="col-span-4">
                  <InputCustom disabled control={form.control} name="token" />
                </div>
                <div className="col-span-1">
                  <Button
                    size="icon"
                    type="button"
                    onClick={handleRefreshToken}
                  >
                    <RefreshCcwIcon className="size-4" />
                  </Button>
                </div>
              </div>
              {!!form.watch("tableNumber") && !!form.watch("token") && (
                <div className="my-4">
                  <img src={generateQRCode(url)} alt="qr-code" />
                </div>
              )}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">Url</div>
                <div className="col-span-3">{url}</div>
              </div>
              <Button
                disabled={addTableMutation.isLoading}
                className="mt-6 w-full"
              >
                {isUpdate ? "Lưu" : "Thêm bàn"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}
