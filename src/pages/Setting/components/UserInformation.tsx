import { updateMe } from "@/apis/user.api";
import AvatarCustom from "@/components/dev/AvatarCustom";
import InputCustom from "@/components/dev/Form/InputCustom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AppContext } from "@/contexts/app.context";
import { toast } from "@/hooks/use-toast";
import { MeRequest, User } from "@/types/user.type";
import { setUserToLocalStorage } from "@/utils/auth";
import { UserInformationSchema } from "@/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

type FormData = yup.InferType<typeof UserInformationSchema>;

interface Props {
  readonly me?: User;
}

export default function UserInformation({ me }: Props) {
  console.log(me);
  const { setUser } = useContext(AppContext);
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File>();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : (me?.avatar ?? "");
  }, [file, me]);

  const form = useForm<FormData>({
    defaultValues: {
      name: me?.name,
    },
    resolver: yupResolver(UserInformationSchema),
  });

  const updateMeMutation = useMutation({
    mutationFn: (body: MeRequest) => updateMe(body),
  });

  const onSubmit = form.handleSubmit((values) => {
    const body: MeRequest = Object.fromEntries(
      Object.entries({
        name: values.name,
        avatar: file as File,
      }).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !Number.isNaN(value)
      )
    ) as unknown as MeRequest;
    updateMeMutation.mutate(body, {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
        setUser(res.data.data);
        setUserToLocalStorage(res.data.data);
        queryClient.invalidateQueries({
          queryKey: ["me"],
        });
      },
    });
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0];
    setFile(fileFromLocal);
  };

  useEffect(() => {
    if (me) {
      form.setValue("name", me?.name as string);
    }
  }, [me]);

  return (
    <div className="px-4 py-2 rounded-lg shadow-lg space-y-2">
      <h2 className="font-semibold">Thông tin cá nhân</h2>
      <div className="flex items-center space-x-2">
        {previewImage && (
          <AvatarCustom url={previewImage} className="size-28" />
        )}
        <input
          ref={fileRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          onClick={() => fileRef.current?.click()}
          size="sm"
        >
          Thay đổi ảnh
        </Button>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <InputCustom
              control={form.control}
              name="name"
              placeholder="Tên"
              label="Tên"
            />
            <Button>Lưu thông tin</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
