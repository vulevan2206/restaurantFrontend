import { checkAvailableTable } from "@/apis/table.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { path } from "@/constants/path";
import { AppContext } from "@/contexts/app.context";
import { toast } from "@/hooks/use-toast";
import useQueryParams from "@/hooks/useQueryParams";
import {
  setCustomerIdToLocalStorage,
  setCustomerNameToLocalStorage,
  setTableNumberToLocalStorage,
} from "@/utils/auth";
import { LoginToOrderSchema } from "@/utils/rules";
import { generateShortUUID } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

type FormData = yup.InferType<typeof LoginToOrderSchema>;

export default function Table() {
  const { tableNumber } = useParams();
  const { token } = useQueryParams();
  const params = {
    table_number: tableNumber as string,
    token,
  };

  const { setTableNumber, setCustomerName, setCustomerId } =
    useContext(AppContext);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(LoginToOrderSchema),
  });

  const checkAvailableTableMutation = useMutation({
    mutationFn: () => checkAvailableTable(params),
    onSuccess: (res) => {
      toast({
        description: res.data.message,
      });
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await checkAvailableTableMutation.mutateAsync();
    setCustomerName(values.name);
    setTableNumber(tableNumber as string);
    setCustomerNameToLocalStorage(values.name);
    setTableNumberToLocalStorage(tableNumber as string);
    const id = generateShortUUID(5);
    setCustomerId(id);
    setCustomerIdToLocalStorage(id);
    navigate(path.menu);
  });

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-sm border rounded-lg px-6 py-4 mt-6 shadow-md">
        <h1 className="font-bold text-center mb-4 text-xl">
          Đăng nhập gọi món
        </h1>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <InputCustom
              control={form.control}
              name="name"
              placeholder="Tên"
              label="Tên"
            />
            <Button className="mt-4 w-full">Đăng nhập</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
