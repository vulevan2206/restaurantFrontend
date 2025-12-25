import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DialogDeleteOrder from "@/pages/Manage/ManageOrder/components/DialogDeleteOrder";
import DialogUpdateOrder from "@/pages/Manage/ManageOrder/components/DialogUpdateOrder";
import OrderStatus from "@/pages/Manage/ManageOrder/components/OrderStatus";
import { Order, OrderWithProducts } from "@/types/order.type";
import { formatCurrency, formatDateTime } from "@/utils/utils";

type OrderItem = Order | OrderWithProducts;

interface Props {
  readonly orders?: OrderItem[];
}

export default function OrderTable({ orders }: Props) {
  return (
    <Table className="font-semibold">
      <TableHeader>
        <TableRow>
          <TableHead>Bàn</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Món ăn</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Người xử lý</TableHead>
          <TableHead>Tạo/Cập nhật</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders && orders.length > 0 ? (
          orders.map((order: OrderItem) => {
            const products = Array.isArray(order.product)
              ? order.product
              : [order.product];
            const firstProduct = products[0];

            return (
              <TableRow key={order._id}>
                <TableCell>{order.table_number}</TableCell>
                <TableCell>
                  {order.customer_name}(#{order.customer_id})
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <img
                      src={firstProduct.image}
                      alt={firstProduct.name}
                      className="size-16 rounded-lg object-cover mr-2"
                    />
                    <div>
                      <p className="font-semibold flex items-center">
                        {firstProduct.name}{" "}
                        <span className="p-1 flex items-center justify-center bg-secondary text-secondary-foreground text-sm rounded-full ml-1">
                          x{order.buy_count}
                        </span>
                        {products.length > 1 && (
                          <span className="ml-2 text-sm italic">+{products.length - 1} món khác</span>
                        )}
                      </p>
                      <p className="italic">
                        {formatCurrency(firstProduct.price)}đ
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <OrderStatus defaultStatus={order.status} orderId={order._id} />
                </TableCell>
                <TableCell>{order.assignee?.name}</TableCell>
                <TableCell>
                  <p>{formatDateTime(order.createdAt)}</p>
                  <p>{formatDateTime(order.updatedAt)}</p>
                </TableCell>
                <TableCell className="space-x-2">
                  {/* cast to Order for backward-compatible dialog props */}
                  <DialogUpdateOrder order={order as unknown as Order} />
                  <DialogDeleteOrder order={order as unknown as Order} />
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center italic py-4">
              Không có đơn hàng phù hợp
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
