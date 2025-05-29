import { createCategory, updateCategory } from "@/apis/category.api";
import InputCustom from "@/components/dev/Form/InputCustom";
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
import { Category } from "@/types/category.type";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CategorySchema } from "@/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
interface Props {
  readonly category?: Category;
}

export default function DialogCategory({ category }: Props) {
  const isUpdate = !!category;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm({
    defaultValues: {
      name: category ? category.name : "",
    },
    resolver: yupResolver(CategorySchema),
  });

  const createCategoryMutation = useMutation({
    mutationFn: (body: { name: string }) => createCategory(body),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name: string } }) =>
      updateCategory(id, body),
  });

  const onSubmit = form.handleSubmit((values) => {
    const { name } = values;
    if (name.trim().length === 0) return;
    const id = category?._id as string;
    if (isUpdate) {
      updateCategoryMutation.mutate(
        { id, body: { name } },
        {
          onSuccess: (res) => {
            toast({
              description: res.data.message,
            });
            queryClient.invalidateQueries({
              queryKey: ["categories"],
            });
            setOpen(false);
          },
        }
      );
      return;
    }
    createCategoryMutation.mutate(values, {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
        setOpen(false);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isUpdate && <EditIcon className="size-4 cursor-pointer" />}
        {!isUpdate && (
          <Button>
            <PlusIcon />
            <span>Thêm danh mục</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <InputCustom
              control={form.control}
              name="name"
              placeholder="Tên danh mục"
              label="Tên danh mục"
            />
            <Button>{isUpdate ? "Lưu" : "Tạo"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
