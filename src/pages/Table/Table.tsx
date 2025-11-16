import { checkTableSession, createTableSession } from "@/apis/table.api";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, PhoneCall } from "lucide-react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

type FormData = yup.InferType<typeof LoginToOrderSchema>;

export default function Table() {
  const { tableNumber } = useParams();
  const { token } = useQueryParams();

  const { setTableNumber, setCustomerName, setCustomerId } =
    useContext(AppContext);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
    },
    resolver: yupResolver(LoginToOrderSchema),
  });

  // Check if table has active session
  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["table-session", tableNumber],
    queryFn: () => checkTableSession(Number(tableNumber)),
    enabled: !!tableNumber,
  });

  const hasActiveSession = sessionData?.data.data.hasActiveSession;
  const activeSession = sessionData?.data.data.session;

  const createSessionMutation = useMutation({
    mutationFn: createTableSession,
    onSuccess: (res) => {
      toast({
        description: res.data.message,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const customerId = generateShortUUID(5);

    await createSessionMutation.mutateAsync({
      table_number: Number(tableNumber),
      customer_id: customerId,
      customer_name: values.name,
      token: token as string,
    });

    setCustomerName(values.name);
    setTableNumber(tableNumber as string);
    setCustomerId(customerId);
    setCustomerNameToLocalStorage(values.name);
    setTableNumberToLocalStorage(tableNumber as string);
    setCustomerIdToLocalStorage(customerId);
    navigate(path.menu);
  });

  const handleRequestStaff = () => {
    toast({
      title: "Đã gửi yêu cầu hỗ trợ",
      description: "Nhân viên sẽ đến hỗ trợ bạn trong giây lát.",
    });
    // TODO: Implement socket notification to staff
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Đang kiểm tra bàn...</p>
      </div>
    );
  }

  // If table has active session, show locked UI
  if (hasActiveSession) {
    return (
      <div className="flex justify-center px-4">
        <div className="w-full max-w-md border rounded-lg px-6 py-6 mt-6 shadow-md">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <AlertCircle className="w-8 h-8" />
            <h1 className="font-bold text-xl">Bàn đang được sử dụng</h1>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Bàn số:</span> {activeSession?.table_number}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Người đặt:</span> {activeSession?.customer_name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Thời gian đăng nhập:</span>{" "}
              {activeSession?.logged_in_at
                ? new Date(activeSession.logged_in_at).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">
              Hiện tại chỉ có một người có thể đặt món cho bàn này.
              Nếu bạn cần trợ giúp, vui lòng liên hệ nhân viên.
            </p>

            <Button
              onClick={handleRequestStaff}
              className="w-full flex items-center justify-center gap-2"
              variant="default"
            >
              <PhoneCall className="w-4 h-4" />
              Yêu cầu nhân viên hỗ trợ
            </Button>

            <Button
              onClick={() => navigate(path.home)}
              variant="outline"
              className="w-full"
            >
              Quay về trang chủ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Normal login form if table is available
  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-sm border rounded-lg px-6 py-4 mt-6 shadow-md">
        <h1 className="font-bold text-center mb-4 text-xl">
          Đăng nhập gọi món
        </h1>
        <p className="text-sm text-gray-600 text-center mb-4">
          Bàn số {tableNumber}
        </p>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <InputCustom
              control={form.control}
              name="name"
              placeholder="Nhập tên của bạn"
              label="Tên"
            />
            <Button
              className="mt-4 w-full"
              disabled={createSessionMutation.isPending}
            >
              {createSessionMutation.isPending ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
