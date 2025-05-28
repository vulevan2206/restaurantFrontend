import { updateOrder } from "@/apis/order.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import useOrderQueryConfig from "@/hooks/useOrderQueryConfig";
import DialogChooseProduct from "@/pages/Manage/ManageOrder/components/DialogChooseProduct";
import { Order, OrderUpdateRequest } from "@/types/order.type";
import { Product } from "@/types/product.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  readonly order: Order;
}

export default function DialogUpdateOrder({ order }: Props) {
  const queryClient = useQueryClient();
  const orderQueryConfig = useOrderQueryConfig();
  const [open, setOpen] = useState<boolean>(false);
  const [buyCount, setBuyCount] = useState<string>(String(order.buy_count));
  const [product, setProduct] = useState<Product>(order.product);

  const updateOrderMutation = useMutation({
    mutationFn: (params: OrderUpdateRequest) => updateOrder(params),
  });

  const handleUpdate = () => {
    const params = {
      order_id: String(order._id),
      product_id: product._id,
      buy_count: buyCount,
    };
    updateOrderMutation.mutate(params, {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["order-statistics", orderQueryConfig],
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <EditIcon className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Cập nhật đơn hàng</DialogHeader>
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-3 text-sm">Món ăn</div>
          <div className="col-span-6 flex items-center">
            <img
              src={product.image}
              alt={product.name}
              className="size-16 rounded-md mr-1"
            />
            <p className="font-semibold">{product.name}</p>
          </div>
          <div className="col-span-3">
            <DialogChooseProduct setProduct={setProduct} />
          </div>
        </div>
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-3 text-sm">Số lượng</div>
          <div className="col-span-3">
            <Input
              value={buyCount}
              onChange={(e) => setBuyCount(e.target.value)}
              placeholder="Số lượng"
            />
          </div>
        </div>
        <div>
          <Button className="mt-4" onClick={handleUpdate}>
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
