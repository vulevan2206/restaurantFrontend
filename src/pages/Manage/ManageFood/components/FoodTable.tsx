import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DialogFood from "@/pages/Manage/ManageFood/components/DialogFood";
import { Product } from "@/types/product.type";
import { formatCurrency } from "@/utils/utils";

interface Props {
  readonly products: Product[];
}

export default function FoodTable({ products }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableHead>ID</TableHead>
        <TableHead>Ảnh</TableHead>
        <TableHead>Danh mục</TableHead>
        <TableHead>Tên</TableHead>
        <TableHead>Mô tả</TableHead>
        <TableHead>Giá</TableHead>
        <TableHead>Đã bán</TableHead>
        <TableHead>Lượt xem</TableHead>
        <TableHead>Trạng thái</TableHead>
        <TableHead>Action</TableHead>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id} className="font-semibold">
            <TableCell>{product._id}</TableCell>
            <TableCell>
              <img
                src={product.image}
                alt={product.name}
                className="size-16 rounded-lg object-cover mr-2"
              />
            </TableCell>
            <TableCell>{product.category.name}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell className="italic text-destructive">
              {formatCurrency(product.price)}đ
            </TableCell>
            <TableCell>{product.sold}</TableCell>
            <TableCell>{product.view}</TableCell>
            <TableCell>{product.status}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <DialogFood product={product} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
