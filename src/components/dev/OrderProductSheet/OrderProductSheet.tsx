import { addOrder } from "@/apis/order.api";
import QuantityController from "@/components/dev/QuantityController";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppContext } from "@/contexts/app.context";
import { toast } from "@/hooks/use-toast";
import { OrderRequest } from "@/types/order.type";
import { ProductOrder } from "@/types/product.type";
import { formatCurrency } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { ShoppingCartIcon } from "lucide-react";
import { useContext, useMemo, useState } from "react";

export default function OrderProductSheet() {
  const {
    productOrders,
    setProductOrders,
    customerName,
    tableNumber,
    customerId,
  } = useContext(AppContext);
  const [openSheet, setOpenSheet] = useState(false);

  const setValue = (id: string) => (value: number) => {
    setProductOrders((prev) =>
      produce(prev, (draft: ProductOrder[]) => {
        const existProduct = draft.find((obj) => obj.product._id === id);
        if (existProduct) {
          existProduct.buy_count = value;
        }
      })
    );
  };

  const totalPrice = useMemo(() => {
    const res = productOrders.reduce((curr, productOrder) => {
      return curr + productOrder.product.price * productOrder.buy_count;
    }, 0);
    return res;
  }, [productOrders]);

  const addOrderMutation = useMutation({
    mutationFn: (body: OrderRequest) => addOrder(body),
  });

  const handleOrder = () => {
    const productsChoosen = productOrders.map((produceOrder) => ({
      id: produceOrder.product._id,
      buy_count: produceOrder.buy_count,
    }));
    const payload: OrderRequest = {
      customer_name: customerName,
      customer_id: customerId,
      table_number: parseInt(tableNumber),
      products: productsChoosen,
    };
    addOrderMutation.mutate(payload, {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
        setProductOrders([]);
        setOpenSheet(false);
      },
    });
  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger>
        <div
          aria-hidden="true"
          className="relative inline-flex items-center justify-center w-12 h-12 rounded-full text-foreground cursor-pointer hover:bg-muted transition-all duration-300 ease-in-out"
          onClick={() => setOpenSheet(true)}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          <div className="absolute top-0 right-0 text-xs flex items-center justify-center w-5 h-5 bg-red-600 text-white font-bold rounded-full shadow-lg">
            {productOrders?.length ?? 0}
          </div>
        </div>
      </SheetTrigger>
      <SheetContent className="px-0">
        <SheetHeader className="mb-4 px-2">
          <SheetTitle>Gọi món</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1">
            <div className="h-full px-2">
              {productOrders?.map((productOrder) => (
                <div
                  key={productOrder.product._id}
                  className="mb-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <img
                      src={productOrder.product.image}
                      alt={productOrder.product.name}
                      className="size-20 object-cover rounded-md"
                    />
                    <div className="ml-2">
                      <p>{productOrder.product.name}</p>
                      <p className="text-red-700 font-bold">
                        {formatCurrency(productOrder.product.price)}đ
                      </p>
                    </div>
                  </div>
                  <div>
                    <QuantityController
                      value={productOrder.buy_count}
                      setValue={setValue(productOrder.product._id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="py-6 px-4">
            <p className="mb-2 text-xl font-semibold">
              Tổng tiền:{" "}
              <span className="font-bold text-2xl text-red-700">
                {formatCurrency(totalPrice)}đ
              </span>
            </p>
            <Button className="w-full" onClick={handleOrder}>
              Đặt món
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
