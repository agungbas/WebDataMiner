import { useEffect, useState } from "react";
import { tokenInfo } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

// This page simulates how the Frame will look in Warpcast
export default function Frame() {
  const [step, setStep] = useState<"initial" | "customAmount" | "confirmation">("initial");
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [ethAmount, setEthAmount] = useState<string>("0");

  // Calculate ETH amount based on token amount
  const calculateEthAmount = (tokenAmount: number) => {
    const mockPrice = 0.00042; // Mock price per token
    return (tokenAmount * mockPrice).toFixed(6);
  };

  // Update ETH amount when token amount changes
  useEffect(() => {
    setEthAmount(calculateEthAmount(amount));
  }, [amount]);

  // Handle button clicks
  const handleButtonClick = (buttonIndex: number) => {
    if (step === "initial") {
      if (buttonIndex === 1) {
        setAmount(50);
        setStep("confirmation");
      } else if (buttonIndex === 2) {
        setAmount(250);
        setStep("confirmation");
      } else if (buttonIndex === 3) {
        setAmount(500);
        setStep("confirmation");
      } else if (buttonIndex === 4) {
        setStep("customAmount");
      }
    } else if (step === "customAmount") {
      if (buttonIndex === 1) {
        const parsedAmount = parseInt(customAmount, 10);
        if (!isNaN(parsedAmount) && parsedAmount > 0) {
          setAmount(parsedAmount);
          setStep("confirmation");
        } else {
          alert("Please enter a valid amount");
        }
      } else if (buttonIndex === 2) {
        setStep("initial");
      }
    } else if (step === "confirmation") {
      if (buttonIndex === 1) {
        alert(`This would execute a purchase of ${amount} $BISOU tokens on Base network!`);
        setStep("initial");
      } else if (buttonIndex === 2) {
        setStep("initial");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold mb-4 flex items-center">
            <span className="text-primary">$</span>BISOU Frame Preview
          </h1>
          
          <div className="aspect-[1.91/1] bg-neutral-800 rounded-lg mb-4 relative overflow-hidden">
            {step === "initial" && (
              <div className="absolute inset-0 p-4 flex flex-col">
                <div className="flex items-center mb-4">
                  <img 
                    src={tokenInfo.imageUrl} 
                    alt="$BISOU Token" 
                    className="w-16 h-16 rounded-full mr-4 border-2 border-primary"
                  />
                  <div>
                    <h2 className="text-xl font-bold">$BISOU</h2>
                    <div className="text-xs text-neutral-300 flex items-center mt-1">
                      <span className="bg-neutral-700 rounded-md px-2 py-0.5 mr-2">Base</span>
                      <span className="text-xs truncate">{tokenInfo.contractAddress.substring(0, 16)}...</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-auto mb-4">
                  <h3 className="text-lg mb-2">Select amount to purchase</h3>
                  <p className="text-neutral-300 text-sm">Choose from preset amounts or enter a custom value</p>
                </div>
              </div>
            )}
            
            {step === "customAmount" && (
              <div className="absolute inset-0 p-4 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Enter Custom Amount</h3>
                <p className="text-neutral-300 text-sm mb-4">How many $BISOU tokens would you like to purchase?</p>
                
                <div className="mt-auto mb-4">
                  <div className="bg-neutral-900 p-4 rounded-lg">
                    <input
                      type="text"
                      placeholder="Enter amount of $BISOU"
                      className="bg-neutral-800 border border-neutral-700 text-white px-4 py-3 rounded-lg w-full"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === "confirmation" && (
              <div className="absolute inset-0 p-4 flex flex-col">
                <h3 className="text-xl font-bold mb-2">Confirm Purchase</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-neutral-900 rounded-lg p-3">
                    <span className="text-neutral-300">Amount:</span>
                    <span className="font-medium">{amount} $BISOU</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-neutral-900 rounded-lg p-3">
                    <span className="text-neutral-300">You'll Pay:</span>
                    <span className="font-medium">~{ethAmount} ETH</span>
                  </div>
                </div>
                
                <div className="mt-auto mb-2 text-center">
                  <p className="text-neutral-300 text-sm">Ready to complete this purchase?</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {step === "initial" && (
              <>
                <button onClick={() => handleButtonClick(1)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2 text-sm">Buy 50 $BISOU</button>
                <button onClick={() => handleButtonClick(2)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2 text-sm">Buy 250 $BISOU</button>
                <button onClick={() => handleButtonClick(3)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2 text-sm">Buy 500 $BISOU</button>
                <button onClick={() => handleButtonClick(4)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2 text-sm">Custom Amount</button>
              </>
            )}
            
            {step === "customAmount" && (
              <>
                <button onClick={() => handleButtonClick(1)} className="flex-1 bg-primary hover:bg-opacity-90 text-white rounded-lg py-2 text-sm">Continue</button>
                <button onClick={() => handleButtonClick(2)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2 text-sm">Go Back</button>
              </>
            )}
            
            {step === "confirmation" && (
              <>
                <button onClick={() => handleButtonClick(1)} className="flex-1 bg-primary hover:bg-opacity-90 text-white rounded-lg py-2 text-sm">Confirm Purchase</button>
                <button onClick={() => handleButtonClick(2)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg py-2 text-sm">Go Back</button>
              </>
            )}
          </div>
          
          <div className="mt-6 border-t border-neutral-800 pt-4">
            <h3 className="font-medium mb-2">About this Frame:</h3>
            <p className="text-sm text-neutral-300">
              This is a preview of how the $BISOU purchase frame will appear in Warpcast. 
              In the actual Frame, users can interact directly from their Warpcast feed.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
