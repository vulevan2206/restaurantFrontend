import { addOrder, findCustomer } from "@/apis/order.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import QuantityController from "@/components/dev/QuantityController";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AppContext } from "@/contexts/app.context";
import { toast } from "@/hooks/use-toast";
import DialogChooseProduct from "@/pages/Manage/ManageOrder/components/DialogChooseProduct";
import { Customer, OrderRequest } from "@/types/order.type";
import { Product } from "@/types/product.type";
import { formatCurrency, generateShortUUID } from "@/utils/utils";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { produce } from "immer";
import { useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface ProductPurchase {
  product: Product;
  buyCount: number;
}

export default function DialogCreateNewOrder() {
  const { user } = useContext(AppContext);
  const [open, setOpen] = useState<boolean>(false);
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [productsChoosen, setProductsChoosen] = useState<ProductPurchase[]>([]);
  const [customer, setCustomer] = useState<Customer>();
  const form = useForm({
    defaultValues: {
      idCustomer: "",
      customerName: "",
      tableNumber: "",
    },
  });

  const handleAddProduct = (product: Product) => {
    setProductsChoosen((prev) =>
      produce(prev, (draft: ProductPurchase[]) => {
        const existProduct = draft?.find(
          (obj) => obj.product._id === product._id
        );
        if (existProduct) {
          existProduct.buyCount += 1;
        } else {
          const newProduct: ProductPurchase = {
            product,
            buyCount: 1,
          };
          draft.push(newProduct);
        }
      })
    );
  };

  const setValue = (id: string) => (value: number) => {
    setProductsChoosen((prev) =>
      produce(prev, (draft: ProductPurchase[]) => {
        const existProduct = draft.find((obj) => obj.product._id === id);
        if (existProduct) {
          existProduct.buyCount = value;
        }
      })
    );
  };

  const totalPrice = useMemo(() => {
    const res = productsChoosen.reduce((curr, productChoosen) => {
      return curr + productChoosen.product.price * productChoosen.buyCount;
    }, 0);
    return res;
  }, [productsChoosen]);

  const findCustomerMutation = useMutation({
    mutationFn: (customer_id: string) => findCustomer(customer_id),
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!values.idCustomer) return;
    findCustomerMutation.mutate(values.idCustomer, {
      onSuccess: (res) => {
        setCustomer(res.data.data);
      },
    });
  });

  const addOrderMutation = useMutation({
    mutationFn: (body: OrderRequest) => addOrder(body),
  });

  const handleOrder = () => {
    const customerName = form.watch("customerName");
    const tableNumber = form.watch("tableNumber");
    if (isNewCustomer && !customerName && !tableNumber) return;
    if (!isNewCustomer && !customer) return;
    const productsPayload = productsChoosen.map((productChoosen) => ({
      id: productChoosen.product._id,
      buy_count: productChoosen.buyCount,
    }));
    const payload: OrderRequest = {
      table_number: (isNewCustomer
        ? tableNumber
        : customer?.table_number) as string,
      customer_id: (isNewCustomer
        ? generateShortUUID(5)
        : customer?.customer_id) as string,
      customer_name: (isNewCustomer
        ? customerName
        : customer?.customer_name) as string,
      assignee: user?._id as string,
      products: productsPayload,
    };
    addOrderMutation.mutate(payload, {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
        setProductsChoosen([]);
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <PlusIcon /> Tạo đơn hàng
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] flex flex-col">
        <DialogHeader className="mb-2">Tạo mới đơn hàng</DialogHeader>
        <div className="flex items-center space-x-2 mb-3">
          <Label htmlFor="airplane-mode">Khách hàng mới</Label>
          <Switch
            id="airplane-mode"
            checked={isNewCustomer}
            onCheckedChange={setIsNewCustomer}
          />
        </div>
        {!isNewCustomer && (
          <>
            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className="grid grid-cols-6 gap-2">
                  <div className="col-span-4">
                    <InputCustom
                      control={form.control}
                      name="idCustomer"
                      placeholder="Nhập id khách hàng"
                    />
                  </div>
                  <Button className="col-span-2">Tìm kiếm</Button>
                </div>
              </form>
            </Form>
            {customer && (
              <div className="p-1 border border-gray-200 rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Thông tin khách hàng
                </h2>
                <p className="text-gray-700">
                  Tên khách hàng:{" "}
                  <span className="font-medium">{customer.customer_name}</span>
                </p>
                <p className="text-gray-700">
                  Mã khách hàng:{" "}
                  <span className="font-medium">{customer.customer_id}</span>
                </p>
                <p className="text-gray-700">
                  Bàn hiện đang ngồi:{" "}
                  <span className="font-medium">{customer.table_number}</span>
                </p>
              </div>
            )}
          </>
        )}
        {isNewCustomer && (
          <Form {...form}>
            <form>
              <div className="grid grid-cols-6 gap-2 items-center">
                <div className="col-span-2 text-sm">Tên khách hàng</div>
                <div className="col-span-4">
                  <InputCustom
                    control={form.control}
                    name="customerName"
                    placeholder="Nhập tên khách hàng"
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2 items-center">
                <div className="col-span-2 text-sm">Số bàn</div>
                <div className="col-span-4">
                  <InputCustom
                    control={form.control}
                    name="tableNumber"
                    placeholder="Nhập số bàn"
                  />
                </div>
              </div>
            </form>
          </Form>
        )}
        <DialogChooseProduct setProduct={handleAddProduct} isUpdate={false} />
        <Separator className="my-2" />
        <div className="flex-1 overflow-auto">
          {productsChoosen?.map((productChoosen) => (
            <div
              key={productChoosen.product._id}
              className="mb-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <img
                  src={productChoosen.product.image}
                  alt={productChoosen.product.name}
                  className="size-16 object-cover rounded-md"
                />
                <div className="ml-2">
                  <p className="font-semibold">{productChoosen.product.name}</p>
                  <p className="text-red-700 font-bold">
                    {formatCurrency(productChoosen.product.price)}đ
                  </p>
                </div>
              </div>
              <div>
                <QuantityController
                  value={productChoosen.buyCount}
                  setValue={setValue(productChoosen.product._id)}
                />
              </div>
            </div>
          ))}
        </div>
        {!!productsChoosen.length && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="mb-2 text-xl font-semibold">
                Tổng tiền:{" "}
                <span className="font-bold text-2xl text-red-700">
                  {formatCurrency(totalPrice)}đ
                </span>
              </p>
              <Button type="button" className="w-full" onClick={handleOrder}>
                Đặt hàng
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
