import { deleteOrder } from "@/apis/order.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import useOrderQueryConfig from "@/hooks/useOrderQueryConfig";
import { Order } from "@/types/order.type";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  readonly order: Order;
}

export default function DialogDeleteOrder({ order }: Props) {
  const queryClient = useQueryClient();
  const orderQueryConfig = useOrderQueryConfig();
  const [open, setOpen] = useState<boolean>(false);

  const deleteOrderMutation = useMutation({
    mutationFn: () => deleteOrder(order._id),
    onSuccess: (res) => {
      toast({
        description: res.data.message,
      });
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["order-statistics", orderQueryConfig],
      });
      queryClient.invalidateQueries({
        queryKey: ["order-statistics-table"],
      });
    },
  });

  const handleDelete = () => {
    deleteOrderMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TrashIcon className="size-4 text-destructive" />
      </DialogTrigger>
      <DialogContent>
        <p>Bạn có chắc chắn muốn xóa đơn hàng?</p>
        <div>
          <Button variant="destructive" className="mr-4" onClick={handleDelete}>
            Xóa
          </Button>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
