import { updateOrder } from "@/apis/order.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderStatus } from "@/constants/orderStatus";
import { AppContext } from "@/contexts/app.context";
import useOrderQueryConfig from "@/hooks/useOrderQueryConfig";
import { OrderStatusType, OrderUpdateRequest } from "@/types/order.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

interface Props {
  readonly orderId: string;
  readonly defaultStatus: OrderStatusType;
}

export default function OrderStatus({ orderId, defaultStatus }: Props) {
  const queryClient = useQueryClient();
  const orderQueryConfig = useOrderQueryConfig();
  const [status, setStatus] = useState<string>(defaultStatus);

  const { user } = useContext(AppContext);

  const updateOrderMutation = useMutation({
    mutationFn: (params: OrderUpdateRequest) => updateOrder(params),
  });

  useEffect(() => {
    if (status === defaultStatus) return;
    const params = {
      order_id: orderId,
      status,
      assignee: user?._id,
    };

    updateOrderMutation.mutate(params, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["order-statistics", orderQueryConfig],
        });
        queryClient.invalidateQueries({
          queryKey: ["order-statistics-table"],
        });
      },
    });
  }, [status]);

  return (
    <Select
      disabled={updateOrderMutation.isLoading}
      defaultValue={defaultStatus}
      onValueChange={setStatus}
    >
      <SelectTrigger>
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {Array.from(Object.keys(orderStatus)).map((item) => (
          <SelectItem key={item} value={item as OrderStatusType}>
            {orderStatus[item as OrderStatusType]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
