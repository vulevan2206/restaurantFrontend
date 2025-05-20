import { getProducts } from "@/apis/product.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/product.type";
import { formatCurrency } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  readonly isUpdate?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly setProduct: any;
}

export default function DialogChooseProduct({
  setProduct,
  isUpdate = true,
}: Props) {
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const [open, setOpen] = useState<boolean>(false);

  const name = form.watch("name");
  const debouncedQuery = useMemo(() => {
    return debounce(() => {
      refetch();
    }, 500);
  }, []);

  useEffect(() => {
    if (name) {
      debouncedQuery();
    }
  }, [name, debouncedQuery]);

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts({ limit: "10000", name }),
  });

  const handleSetNewProduct = (product: Product) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setProduct && setProduct(product);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="w-full max-w-full" type="button" variant="secondary">
          {isUpdate ? "Thay đổi" : "Chọn món"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>Chọn sản phẩm</DialogHeader>
        <div>
          <Form {...form}>
            <form>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <InputCustom
                    control={form.control}
                    name="name"
                    placeholder="Nhập tên để tìm kiếm"
                  />
                </div>
                <Button>Tìm kiếm</Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ảnh</TableHead>
                <TableHead>Thông tin</TableHead>
                <TableHead>Giá</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.data.data.content.map((product) => (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => handleSetNewProduct(product)}
                >
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-16 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm italic">{product.description}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-destructive font-bold">
                      {formatCurrency(product.price)}đ
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
