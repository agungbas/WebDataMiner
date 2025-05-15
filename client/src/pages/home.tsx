import { useState } from "react";
import BisouMiniApp from "@/components/BisouMiniApp";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [frameUrl, setFrameUrl] = useState("");

  // Generate shareable Frame URL for Warpcast
  const generateFrameUrl = () => {
    // Check if we're on Replit
    const isReplit = window.location.hostname.includes('.repl.co');
    let baseUrl = window.location.origin;
    
    // If in development mode on localhost, attempt to get the Replit URL
    if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
      // Try to use the REPL_SLUG and REPL_OWNER environment variables if available
      // Since we can't access these directly, we'll use a fallback message
      setFrameUrl('To get a shareable Frame URL, please run this app on Replit');
      return;
    }
    
    const frameUrl = `${baseUrl}/api/frame`;
    setFrameUrl(frameUrl);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="bg-neutral-900 py-4 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-primary">$</span>BISOU Mini App
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">$BISOU Token DEX Interface</h2>
            <p className="text-neutral-300 mb-6">
              Purchase $BISOU tokens on the Base network through this DEX interface.
              Connect your wallet to buy tokens directly or use the Warpcast Mini App.
            </p>
            
            <BisouMiniApp />
          </div>
          
          <div>
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Warpcast Frame</h2>
                <p className="text-neutral-300 mb-4">
                  Share this mini app as a Warpcast Frame by using the URL below:
                </p>
                
                <button 
                  onClick={generateFrameUrl}
                  className="w-full bg-primary hover:bg-opacity-90 text-white font-medium py-3 rounded-lg transition-all duration-200 mb-4"
                >
                  Generate Frame URL
                </button>
                
                {frameUrl && (
                  <div className="bg-neutral-800 p-3 rounded-lg mt-2">
                    <p className="text-sm font-mono break-all text-neutral-300">{frameUrl}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(frameUrl);
                        alert("URL copied to clipboard!");
                      }}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Copy to clipboard
                    </button>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">How to use:</h3>
                  <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-2">
                    <li>Copy the Frame URL above</li>
                    <li>Share it in a cast on Warpcast</li>
                    <li>Users can interact with the $BISOU purchase options directly in their feed</li>
                  </ol>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800">
                  <h3 className="font-medium mb-2">Test your frame:</h3>
                  <p className="text-sm text-neutral-300 mb-3">
                    You can verify if your frame works correctly using the Warpcast Frame validator:
                  </p>
                  <a 
                    href="https://warpcast.com/~/developers/frames" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Warpcast Frame Validator
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="bg-neutral-900 py-4 border-t border-neutral-800 mt-8">
        <div className="container mx-auto px-4 text-center text-neutral-400 text-sm">
          $BISOU Token on Base Network • Contract: 0x951Ed6e6e75e913494C19173C30C6D3C59CffF8F
        </div>
      </footer>
    </div>
  );
}
