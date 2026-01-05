import { AppContext } from "@/contexts/app.context";
import { Product } from "@/types/product.type";
import { formatCurrency } from "@/utils/utils";
import { ShoppingCartIcon } from "lucide-react";
import { useContext } from "react";
import { produce } from "immer";
import { toast } from "@/hooks/use-toast";

export default function ProductCardMini({ product }: { product: Product }) {
  const { setProductOrders } = useContext(AppContext);

  const handleAddToCart = () => {
    setProductOrders((prev) =>
      produce(prev, (draft) => {
        const exist = draft.find((obj) => obj.product._id === product._id);
        if (exist) { exist.buy_count += 1; } 
        else { draft.push({ product, buy_count: 1 }); }
      })
    );
    toast({ description: `Đã thêm ${product.name} vào giỏ` });
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm mt-2">
      <img src={product.image} alt={product.name} className="h-32 w-full object-cover" />
      <div className="p-3">
        <h4 className="line-clamp-1 text-sm font-bold text-gray-800">{product.name}</h4>
        <p className="text-xs font-bold text-red-600 my-1">{formatCurrency(product.price)}đ</p>
        <button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2 text-xs font-medium text-white transition-all hover:bg-orange-600 active:scale-95"
        >
          <ShoppingCartIcon size={14} />
          <span>Thêm ngay</span>
        </button>
      </div>
    </div>
  );
}