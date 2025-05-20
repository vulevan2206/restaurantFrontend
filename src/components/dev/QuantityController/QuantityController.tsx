import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

interface Props {
  readonly value?: number;
  readonly setValue?: (n: number) => void;
}

export default function QuantityController({ value = 0, setValue }: Props) {
  const handleIncrease = () => {
    const newValue = value + 1;
    setValue && setValue(newValue);
  };

  const handleDecrease = () => {
    if (value <= 1) return;
    const newValue = value - 1;
    setValue && setValue(newValue);
  };

  return (
    <div className="flex items-center">
      <Button size="icon" onClick={handleDecrease} disabled={value === 1}>
        <MinusIcon />
      </Button>
      <Input value={value} className="w-[30px] mx-1 px-2 text-center" />
      <Button size="sm" onClick={handleIncrease}>
        <PlusIcon />
      </Button>
    </div>
  );
}
