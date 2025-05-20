import { updateMyPassword } from "@/apis/user.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { ErrorResponse } from "@/types/utils.type";
import { ChangePasswordSchema } from "@/utils/rules";
import { isAxiosUnprocessableEntity } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = yup.InferType<typeof ChangePasswordSchema>;

export default function ChangePassword() {
  const form = useForm<FormData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: yupResolver(ChangePasswordSchema),
  });

  const updateMyPasswordMutation = useMutation({
    mutationFn: (body: FormData) => updateMyPassword(body),
  });

  const onSubmit = form.handleSubmit((values) => {
    updateMyPasswordMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntity<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data;
          if (formError) {
            Object.keys(formError).forEach((key) => {
              form.setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: "Server",
              });
            });
          }
        }
      },
    });
  });

  return (
    <div className="px-4 py-2 rounded-lg shadow-lg space-y-4">
      <h2 className="font-semibold">Thay đổi mật khẩu</h2>
      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <InputCustom
              control={form.control}
              name="oldPassword"
              placeholder="Mật khẩu cũ"
              label="Mật khẩu cũ"
            />
            <InputCustom
              control={form.control}
              name="newPassword"
              placeholder="Mật khẩu mới"
              label="Mật khẩu mới"
            />
            <InputCustom
              control={form.control}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              label="Nhập lại mật khẩu mới"
            />
            <Button>Lưu thông tin</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
