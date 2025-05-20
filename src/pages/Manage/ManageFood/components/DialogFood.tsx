import { getAllCategories } from "@/apis/category.api";
import { addProduct, updateProduct } from "@/apis/product.api";
import InputCustom from "@/components/dev/Form/InputCustom";
import SelectionCustom from "@/components/dev/Form/SelectionCustom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Product, ProductRequest } from "@/types/product.type";
import { FormControlItem } from "@/types/utils.type";
import { ProductSchema } from "@/utils/rules";
import { yupResolver } from "@hookform/resolvers/yup";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface Props {
  readonly product?: Product;
}

type FormData = yup.InferType<typeof ProductSchema>;

export default function DialogFood({ product }: Props) {
  const queryClient = useQueryClient();
  const isUpdate = !!product;
  const form = useForm<FormData>({
    defaultValues: {
      categoryId: product?.category._id ?? "",
      description: product?.description ?? "",
      name: product?.name ?? "",
      price: String(product?.price ?? ""),
      status: product?.status ?? "",
    },
    resolver: yupResolver(ProductSchema),
  });

  const [open, setOpen] = useState<boolean>(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();
  const previewImage = useMemo(() => {
    return file ? URL.createObjectURL(file) : (product?.image ?? "");
  }, [file, product?.image]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const createProductMutation = useMutation({
    mutationFn: (body: ProductRequest) => addProduct(body),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProductRequest }) =>
      updateProduct(id, body),
  });

  const categoriesSelectionData = useMemo(() => {
    return categories?.data.data.map((category) => ({
      label: category.name,
      value: category._id,
    }));
  }, [categories]);

  const statusSelectionData: FormControlItem[] = [
    {
      label: "Có sẵn",
      value: "AVAILABLE",
    },
    {
      label: "Đã khóa",
      value: "UNAVAILABLE",
    },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0];
    setFile(fileFromLocal);
  };

  const onSubmit = form.handleSubmit((values) => {
    const body: ProductRequest = Object.fromEntries(
      Object.entries({
        name: values.name,
        category: values.categoryId,
        description: values.description,
        image: file as File,
        price: parseInt(values.price),
        status: values.status,
      }).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !Number.isNaN(value)
      )
    ) as unknown as ProductRequest;

    if (isUpdate) {
      const id = product._id;
      updateProductMutation.mutate(
        { id, body },
        {
          onSuccess: (res) => {
            toast({
              description: res.data.message,
            });
            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: ["products"],
            });
          },
        }
      );
      return;
    }
    createProductMutation.mutate(body, {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {isUpdate && <EditIcon className="size-4" />}
        {!isUpdate && (
          <Button>
            <PlusIcon />
            <span>Thêm món ăn</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {!isUpdate ? "Thêm món ăn" : "Chỉnh sửa món ăn"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div>
              <div className="mb-3">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt={product?.name}
                    className="size-36 rounded-lg mb-3"
                  />
                )}
                <input
                  ref={fileRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button type="button" onClick={() => fileRef.current?.click()}>
                  {isUpdate ? "Thay đổi ảnh" : "Thêm ảnh"}
                </Button>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-4">Tên</div>
                <div className="col-span-8">
                  <InputCustom
                    control={form.control}
                    name="name"
                    placeholder="Tên"
                    className="mb-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-4">Danh mục</div>
                <div className="col-span-8">
                  <SelectionCustom
                    control={form.control}
                    name="categoryId"
                    data={categoriesSelectionData}
                    placeholder="Danh mục"
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-4">Mô tả</div>
                <div className="col-span-8">
                  <InputCustom
                    control={form.control}
                    name="description"
                    placeholder="Mô tả"
                    className="mb-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-4">Giá</div>
                <div className="col-span-8">
                  <InputCustom
                    control={form.control}
                    name="price"
                    placeholder="Giá"
                    className="mb-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-4">Trạng thái</div>
                <div className="col-span-8">
                  <SelectionCustom
                    control={form.control}
                    name="status"
                    data={statusSelectionData}
                    placeholder="Trạng thái"
                  />
                </div>
              </div>
              <Button>{isUpdate ? "Lưu" : "Tạo"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
