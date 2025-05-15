import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PurchaseOptionsProps {
  selectedAmount: number;
  customAmount: string;
  ethAmount: string;
  isLoading: boolean;
  onPresetAmountSelect: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
  onPurchase: () => void;
}

export default function PurchaseOptions({
  selectedAmount,
  customAmount,
  ethAmount,
  isLoading,
  onPresetAmountSelect,
  onCustomAmountChange,
  onPurchase
}: PurchaseOptionsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Select Amount</h3>
      
      {/* Preset Amount Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Button
          variant="outline"
          className={`bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 transition-all duration-200 ${selectedAmount === 50 ? 'bg-primary bg-opacity-20' : ''}`}
          onClick={() => onPresetAmountSelect(50)}
        >
          50 $BISOU
        </Button>
        
        <Button
          variant="outline"
          className={`bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 transition-all duration-200 ${selectedAmount === 250 ? 'bg-primary bg-opacity-20' : ''}`}
          onClick={() => onPresetAmountSelect(250)}
        >
          250 $BISOU
        </Button>
        
        <Button
          variant="outline"
          className={`bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-3 transition-all duration-200 ${selectedAmount === 500 ? 'bg-primary bg-opacity-20' : ''}`}
          onClick={() => onPresetAmountSelect(500)}
        >
          500 $BISOU
        </Button>
      </div>
      
      {/* Custom Amount Input */}
      <div className="relative mb-5">
        <label htmlFor="custom-amount" className="block text-sm font-medium text-neutral-300 mb-2">
          Or enter custom amount:
        </label>
        <div className="relative rounded-lg overflow-hidden">
          <Input
            id="custom-amount"
            type="number"
            placeholder="Enter amount"
            value={customAmount}
            onChange={(e) => onCustomAmountChange(e.target.value)}
            className="w-full bg-neutral-800 text-white border-neutral-700 focus:border-primary focus:ring-primary"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
            $BISOU
          </div>
        </div>
      </div>
      
      {/* Price Summary */}
      <div className="bg-neutral-800 rounded-lg p-4 mb-5">
        <div className="flex justify-between items-center">
          <div className="text-neutral-300">You'll Pay</div>
          <div className="font-medium">~{ethAmount} ETH</div>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <div className="text-neutral-400">Network Fee</div>
          <div className="text-neutral-300">~0.0003 ETH</div>
        </div>
      </div>
      
      {/* Buy Button */}
      <Button
        className="w-full bg-primary hover:bg-opacity-90 text-white font-medium py-4 rounded-lg transition-all duration-200"
        onClick={onPurchase}
        disabled={isLoading || selectedAmount <= 0}
      >
        {isLoading ? "Processing..." : "Buy $BISOU"}
      </Button>
    </div>
  );
}
