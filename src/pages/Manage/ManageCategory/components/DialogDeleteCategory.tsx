import { deleteCategory } from "@/apis/category.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Category } from "@/types/category.type";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  readonly category: Category;
}

export default function DialogDeleteCategory({ category }: Props) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState<boolean>(false);

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
  });

  const handleDeleteCategory = () => {
    const id = category._id;
    deleteCategoryMutation.mutate(id, {
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TrashIcon className="size-5 text-destructive cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận</DialogTitle>
        </DialogHeader>
        <p>Bạn chắc chắn muốn xóa danh mục này chứ?</p>
        <div className="flex items-center gap-2 mt-4">
          <Button variant="destructive" onClick={handleDeleteCategory}>
            Xóa
          </Button>
          <Button>Hủy</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
