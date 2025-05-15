import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getTokenPrice } from "@/lib/ethers";

interface TokenCardProps {
  tokenInfo: {
    name: string;
    symbol: string;
    contractAddress: string;
    network: string;
    imageUrl: string;
  };
}

export default function TokenCard({ tokenInfo }: TokenCardProps) {
  const [tokenPrice, setTokenPrice] = useState<string>("0.00042");
  
  // Get current token price
  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const price = await getTokenPrice();
        setTokenPrice(price.toFixed(6));
      } catch (error) {
        console.error("Error fetching token price:", error);
      }
    };
    
    fetchTokenPrice();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-none rounded-xl p-5 mb-6">
      <div className="flex items-center mb-4">
        {/* Token image */}
        <img 
          src={tokenInfo.imageUrl} 
          alt="$BISOU Token" 
          className="w-16 h-16 rounded-full mr-4 border-2 border-primary"
        />
        <div>
          <h2 className="text-xl font-bold">{tokenInfo.symbol}</h2>
          <div className="text-xs text-neutral-300 flex items-center mt-1">
            <span className="bg-neutral-700 rounded-md px-2 py-0.5 mr-2">{tokenInfo.network}</span>
            <span className="text-xs truncate">{tokenInfo.contractAddress.substring(0, 18)}...</span>
          </div>
        </div>
      </div>
      
      {/* Current Price Info */}
      <div className="flex justify-between items-center bg-neutral-900 rounded-lg p-3 mb-4">
        <div className="text-sm text-neutral-300">Current Price</div>
        <div className="text-lg font-medium">{tokenPrice} ETH</div>
      </div>
    </Card>
  );
}
