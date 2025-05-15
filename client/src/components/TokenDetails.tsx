import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TokenDetailsProps {
  tokenInfo: {
    name: string;
    symbol: string;
    contractAddress: string;
    network: string;
    totalSupply: string;
  };
}

export default function TokenDetails({ tokenInfo }: TokenDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="rounded-xl bg-neutral-900 p-4 mb-6">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">Token Details</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-neutral-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-neutral-400" />
        )}
      </div>
      
      {isOpen && (
        <div className="mt-3">
          <div className="text-sm">
            <div className="flex justify-between py-2 border-b border-neutral-800">
              <span className="text-neutral-400">Contract</span>
              <a 
                href={`https://basescan.org/address/${tokenInfo.contractAddress}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary truncate ml-2"
              >
                {tokenInfo.contractAddress}
              </a>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-800">
              <span className="text-neutral-400">Network</span>
              <span>{tokenInfo.network}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-neutral-400">Total Supply</span>
              <span>{tokenInfo.totalSupply}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
