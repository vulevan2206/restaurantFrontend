import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppContext } from "@/contexts/app.context";
import { Product, ProductOrder } from "@/types/product.type";
import { formatCurrency } from "@/utils/utils";
import { FlameIcon, ShoppingCartIcon } from "lucide-react";
import { useContext, useState } from "react";
import { produce } from "immer";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { increaseView } from "@/apis/product.api";

interface Props {
  readonly product: Product;
  readonly isBestSeller?: boolean;
}

export default function ProductCard({ product, isBestSeller = false }: Props) {
  const { setProductOrders, tableNumber } = useContext(AppContext);
  const [open, setOpen] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<number>(product.view);
  const canOrder = !!tableNumber;

  const handleAddProductToCart = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setProductOrders((prev) =>
      produce(prev, (draft: ProductOrder[]) => {
        const existProduct = draft?.find(
          (obj) => obj.product._id === product._id
        );
        if (existProduct) {
          existProduct.buy_count += 1;
        } else {
          draft.push({ product, buy_count: 1 });
        }
      })
    );
    toast({
      description: "Thêm sản phẩm vào giỏ hàng thành công",
    });
  };

  const increaseViewMutation = useMutation({
    mutationFn: (id: string) => increaseView(id),
    onSuccess: () => {
      setViewCount((prev) => prev + 1);
    },
  });

  const handleViewProduct = async () => {
    await increaseViewMutation.mutateAsync(product._id);
    setOpen(true);
  };

  return (
    <div>
      <Card
        className="relative rounded-lg shadow-md bg-muted text-muted-foreground cursor-pointer"
        onClick={handleViewProduct}
      >
        {isBestSeller && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full space-x-1 flex items-center flame-animation">
            <FlameIcon className="size-4" /> Bán Chạy
          </span>
        )}
        <CardContent>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="px-4 py-6">
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <h3 className="text-sm font-semibold mb-2 truncate">
              {product.description}
            </h3>
            <p className="text-xl font-bold text-red-700 mb-2">
              {formatCurrency(product.price)}đ
            </p>
            {canOrder && (
              <Button
                className="w-full"
                onClick={(e) => handleAddProductToCart(e)}
              >
                <ShoppingCartIcon className="size-5 mr-2" />
                <span>Thêm vào giỏ</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sản phẩm</DialogTitle>
          </DialogHeader>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover rounded-md"
          />
          <div className="px-4 py-6">
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <h3 className="text-sm font-semibold mb-2 truncate">
              {product.description}
            </h3>
            <p className="text-xl font-bold text-red-700 mb-2">
              {formatCurrency(product.price)}đ
            </p>
            <p className="text-sm font-semibold">
              Số lượng đã bán: {product.sold}
            </p>
            <p className="text-sm font-semibold">Số lượt xem: {viewCount}</p>
            {canOrder && (
              <Button className="w-full mt-2" onClick={handleAddProductToCart}>
                <ShoppingCartIcon className="size-5 mr-2" />
                <span>Thêm vào giỏ</span>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
