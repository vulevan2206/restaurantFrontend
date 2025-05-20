import { TableStatistic } from "@/types/order.type";
import { TableIcon } from "@radix-ui/react-icons";
import { CookingPotIcon, LoaderIcon, TruckIcon } from "lucide-react";

interface Props {
  readonly tableStatistic: TableStatistic;
}

export default function TableInformation({ tableStatistic }: Props) {
  return (
    <div className="w-full grid grid-cols-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg shadow">
      <div className="flex items-center justify-center border-r border-primary">
        <div className="font-semibold flex items-center gap-1">
          <TableIcon /> <span>{tableStatistic.tableNumber}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-around gap-2">
        <div className="flex items-center gap-1">
          <LoaderIcon className="size-4" />
          <span className="text-sm">{tableStatistic.cntInprogressOrder}</span>
        </div>
        <div className="flex items-center gap-1">
          <CookingPotIcon className="size-4" />
          <span className="text-sm">{tableStatistic.cntCookingOrder}</span>
        </div>
        <div className="flex items-center gap-1">
          <TruckIcon className="size-4" />
          <span className="text-sm">{tableStatistic.cntServedOrder}</span>
        </div>
      </div>
    </div>
  );
}
