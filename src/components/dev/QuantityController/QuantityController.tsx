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
    // Cho phép giảm xuống 0 thay vì chặn ở 1
    if (value <= 0) return; 
    const newValue = value - 1;
    setValue && setValue(newValue);
  };

  return (
    <div className="flex items-center">
      {/* Bỏ disabled={value === 1} để người dùng có thể nhấn về 0 */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleDecrease}
        type="button"
      >
        <MinusIcon />
      </Button>
      
      <Input 
        value={value} 
        readOnly 
        className="w-[40px] h-9 mx-1 px-1 text-center" 
      />
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleIncrease}
        type="button"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}