import { login } from "@/apis/auth.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { path } from "@/constants/path";
import { AppContext } from "@/contexts/app.context";
import { ErrorResponse } from "@/types/utils.type";
import { LoginSchema } from "@/utils/rules";
import { isAxiosUnprocessableEntity } from "@/utils/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

type FormData = yup.InferType<typeof LoginSchema>;

export default function Login() {
  const { setIsAuthenticated, setUser } = useContext(AppContext);
  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(LoginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) => login(body),
  });

  const navigate = useNavigate();
  const onSubmit = form.handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: (res) => {
        setIsAuthenticated(true);
        setUser(res.data.data.user);
        navigate(path.manageOrder);
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
    <div className="h-screen bg-secondary w-full">
      <div className="relative flex items-center justify-center h-full w-full">
        <img
          src="https://images.pexels.com/photos/12040643/pexels-photo-12040643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="restaurant"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        <div className="w-full max-w-md px-6 py-8 rounded-lg shadow-lg bg-white bg-opacity-60 backdrop-blur-sm backdrop-contrast-50 z-50">
          <h1 className="mb-2 text-center text-3xl font-semibold text-black">
            Đăng Nhập
          </h1>
          <h1 className="mb-6 text-center text-sm font-semibold text-black">
            Đăng nhập để vào quyền quản trị
          </h1>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-5">
              <InputCustom
                control={form.control}
                name="email"
                placeholder="Email"
                label="Email"
                className="text-black"
              />
              <InputCustom
                type="password"
                control={form.control}
                name="password"
                placeholder="Mật khẩu"
                label="Mật khẩu"
                className="text-black"
                classNameInput="text-black"
              />
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200">
                Đăng nhập
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
