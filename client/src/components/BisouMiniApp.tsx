import { useState, useEffect } from "react";
import TokenCard from "./TokenCard";
import PurchaseOptions from "./PurchaseOptions";
import TokenDetails from "./TokenDetails";
import { tokenInfo } from "@shared/schema";
import { calculateEthForTokens } from "@/lib/ethers";
import { useToast } from "@/hooks/use-toast";

export default function BisouMiniApp() {
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [ethAmount, setEthAmount] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Update ETH amount when token amount changes
  useEffect(() => {
    const updateEthAmount = async () => {
      if (selectedAmount > 0) {
        try {
          const amount = await calculateEthForTokens(selectedAmount);
          setEthAmount(amount);
        } catch (error) {
          console.error("Error calculating ETH amount:", error);
        }
      }
    };

    updateEthAmount();
  }, [selectedAmount]);

  // Handle preset amount selection
  const handlePresetAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  // Handle custom amount input
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const parsedAmount = parseInt(value, 10);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      setSelectedAmount(parsedAmount);
    } else {
      setSelectedAmount(0);
    }
  };

  // Handle purchase action
  const handlePurchase = async () => {
    if (selectedAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please select an amount to buy",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // This would connect to wallet and execute purchase
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Purchase initiated",
        description: `This would execute a purchase of ${selectedAmount} $BISOU tokens on Base network!`,
      });
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header with Logo and Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <span className="text-primary">$</span>BISOU
        </h1>
        <div className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300">
          on Base
        </div>
      </div>

      {/* Token Card */}
      <TokenCard tokenInfo={tokenInfo} />

      {/* Purchase Options */}
      <PurchaseOptions
        selectedAmount={selectedAmount}
        customAmount={customAmount}
        ethAmount={ethAmount}
        isLoading={isLoading}
        onPresetAmountSelect={handlePresetAmountSelect}
        onCustomAmountChange={handleCustomAmountChange}
        onPurchase={handlePurchase}
      />

      {/* Token Details */}
      <TokenDetails tokenInfo={tokenInfo} />

      {/* Disclaimer */}
      <div className="text-xs text-neutral-400 text-center mt-6">
        This mini app is for demonstration purposes. Always DYOR before buying any token.
      </div>
    </div>
  );
}
