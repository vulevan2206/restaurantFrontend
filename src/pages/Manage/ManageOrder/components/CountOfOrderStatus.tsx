import { Badge } from "@/components/ui/badge";
import { orderStatus } from "@/constants/orderStatus";
import { OrderStatistic } from "@/types/order.type";
import { PaginationResponse, SuccessResponse } from "@/types/utils.type";
import { AxiosResponse } from "axios";

interface Props {
  readonly ordersStatistics?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | AxiosResponse<SuccessResponse<PaginationResponse<OrderStatistic>>, any>
    | undefined;
}

export default function CountOfOrderStatus({ ordersStatistics }: Props) {
  return (
    <div className="flex items-center gap-4">
      <Badge>
        {orderStatus.IN_PROGRESS}:{" "}
        {ordersStatistics?.data.data.content.cntInprogressOrder}
      </Badge>
      <Badge>
        {orderStatus.COOKING}:{" "}
        {ordersStatistics?.data.data.content.cntCookingOrder}
      </Badge>
      <Badge>
        {orderStatus.REJECTED}:{" "}
        {ordersStatistics?.data.data.content.cntRejectedOrder}
      </Badge>
      <Badge>
        {orderStatus.SERVED}:{" "}
        {ordersStatistics?.data.data.content.cntServedOrder}
      </Badge>
      <Badge>
        {orderStatus.PAID}: {ordersStatistics?.data.data.content.cntPaidOrder}
      </Badge>
    </div>
  );
}
