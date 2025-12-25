import { createUser, updateUser } from "@/apis/user.api";
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
import { Form, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { User, UserRequest } from "@/types/user.type";
import { FormControlItem } from "@/types/utils.type";
import { UserSchema } from "@/utils/rules";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = yup.InferType<typeof UserSchema>;

interface Props {
  readonly user?: User;
}

export default function DialogUser({ user }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : (user?.avatar ?? "");
  }, [file, user]);

  const isUpdate = !!user;
  const form = useForm<FormData>({
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      role: user?.role ?? "",
      isActive: String(user?.isActive ?? ""),
      password: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0];
    setFile(fileFromLocal);
  };

  const roleSelectionData: FormControlItem[] = [
    {
      label: "Admin",
      value: "ADMIN",
    },
    {
      label: "Nhân viên",
      value: "EMPLOYEE",
    },
    {
      label: "Bếp",
      value: "CHEF",
    },
  ];

  const statusSelectionData: FormControlItem[] = [
    {
      value: "true",
      label: "Sử dụng",
    },
    {
      value: "false",
      label: "Đã khóa",
    },
  ];

  const createUserMutation = useMutation({
    mutationFn: (body: UserRequest) => createUser(body),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UserRequest }) =>
      updateUser(id, body),
  });

  const onSubmit = form.handleSubmit((values) => {
    const body: UserRequest = Object.fromEntries(
      Object.entries({
        name: values.name,
        email: values.email,
        role: values.role,
        isActive: values.isActive === "true" ? true : false,
        password: values.password,
        avatar: file as File,
      }).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !Number.isNaN(value)
      )
    ) as unknown as UserRequest;
    const id = user?._id as string;
    if (isUpdate) {
      updateUserMutation.mutate(
        { id, body },
        {
          onSuccess: (res) => {
            toast({
              description: res.data.message,
            });
            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: ["users"],
            });
          },
        }
      );
      return;
    }
    createUserMutation.mutate(body, {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      },
    });
  });

  const showPasswordInput = !isUpdate || (isUpdate && isChangePassword);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isUpdate && <EditIcon className="size-4" />}{" "}
        {!isUpdate && (
          <Button>
            <PlusIcon /> <span>Thêm nhân viên</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
          </DialogTitle>
        </DialogHeader>
        <div className="mb-3">
          {previewImage && (
            <img
              src={previewImage}
              alt={user?.avatar}
              className="size-36 rounded-lg mb-3"
            />
          )}
          <input
            ref={fileRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button type="button" onClick={() => fileRef.current?.click()}>
            {isUpdate ? "Thay đổi ảnh" : "Thêm ảnh"}
          </Button>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <FormLabel>Tên</FormLabel>
                </div>
                <div className="col-span-3">
                  <InputCustom
                    control={form.control}
                    name="name"
                    placeholder="Tên"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <FormLabel>Email</FormLabel>
                </div>
                <div className="col-span-3">
                  <InputCustom
                    disabled={isUpdate}
                    control={form.control}
                    name="email"
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <FormLabel>Role</FormLabel>
                </div>
                <div className="col-span-3">
                  <SelectionCustom
                    control={form.control}
                    name="role"
                    data={roleSelectionData}
                    placeholder="Role"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div className="col-span-1">
                  <FormLabel>Tình trạng</FormLabel>
                </div>
                <div className="col-span-3">
                  <SelectionCustom
                    control={form.control}
                    name="isActive"
                    data={statusSelectionData}
                    placeholder="Tình trạng"
                  />
                </div>
              </div>
              {isUpdate && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="col-span-1">
                    <Label htmlFor="airplane-mode">Đổi mật khẩu</Label>
                  </div>
                  <div className="col-span-3">
                    <Switch
                      id="airplane-mode"
                      checked={isChangePassword}
                      onCheckedChange={setIsChangePassword}
                    />
                  </div>
                </div>
              )}
              {showPasswordInput && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <div className="col-span-1">
                    <FormLabel>Mật khẩu</FormLabel>
                  </div>
                  <div className="col-span-3">
                    <InputCustom
                      control={form.control}
                      name="password"
                      placeholder="Password"
                    />
                  </div>
                </div>
              )}
              <Button>{isUpdate ? "Lưu" : "Tạo"}</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
