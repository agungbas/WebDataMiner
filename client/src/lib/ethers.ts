import { ethers } from "ethers";
import { tokenInfo } from "@shared/schema";

// BISOU Token ABI (partial - just what we need for basic DEX interactions)
const tokenAbi = [
  // Read-only functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  
  // Transaction functions
  "function approve(address spender, uint256 value) returns (bool)",
  "function transfer(address to, uint256 value) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Basic DEX Router ABI (simplified for swapping ETH to tokens)
const dexRouterAbi = [
  // Swap ETH for exact tokens
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)"
];

// Address constants
// Note: Using Uniswap V2 router address on Base, adjust if needed
const DEX_ROUTER_ADDRESS = "0x4752ba5DBc23F44D41AAe9AE89A3b6f21E676840"; // Uniswap V2 Router on Base
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006"; // Wrapped ETH on Base

// Connect to provider
export async function getProvider() {
  // For production, would use a real provider, but this is for demonstration
  return new ethers.JsonRpcProvider("https://mainnet.base.org");
}

// Get signer from provider
export async function getSigner() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  }
  throw new Error("Ethereum provider not found. Please install a wallet like MetaMask.");
}

// Calculate token price (mock implementation)
export async function getTokenPrice(): Promise<number> {
  // Actual implementation would fetch price from DEX or price oracle
  // Mock price for demonstration
  return 0.00042;
}

// Calculate ETH needed for token amount
export async function calculateEthForTokens(tokenAmount: number): Promise<string> {
  const tokenPrice = await getTokenPrice();
  const ethAmount = tokenAmount * tokenPrice;
  return ethAmount.toFixed(6);
}

// Calculate token amount from ETH
export async function calculateTokensFromEth(ethAmount: number): Promise<number> {
  const tokenPrice = await getTokenPrice();
  return Math.floor(ethAmount / tokenPrice);
}

// Purchase tokens with ETH
export async function purchaseTokens(tokenAmount: number): Promise<string> {
  try {
    const signer = await getSigner();
    const provider = await getProvider();
    
    // Calculate ETH amount needed
    const ethAmount = await calculateEthForTokens(tokenAmount);
    const ethAmountWei = ethers.parseEther(ethAmount);
    
    // Create contract instances
    const router = new ethers.Contract(DEX_ROUTER_ADDRESS, dexRouterAbi, signer);
    
    // Prepare swap parameters
    const path = [WETH_ADDRESS, tokenInfo.contractAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    const to = await signer.getAddress();
    
    // Execute swap
    const tx = await router.swapExactETHForTokens(
      0, // amountOutMin (0 for simplicity, would calculate this in production)
      path,
      to,
      deadline,
      { value: ethAmountWei }
    );
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error("Error purchasing tokens:", error);
    throw error;
  }
}

// Check token allowance
export async function checkTokenAllowance(spenderAddress: string): Promise<string> {
  try {
    const signer = await getSigner();
    const tokenContract = new ethers.Contract(tokenInfo.contractAddress, tokenAbi, signer);
    
    const ownerAddress = await signer.getAddress();
    const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);
    
    return ethers.formatUnits(allowance, 18);
  } catch (error) {
    console.error("Error checking allowance:", error);
    throw error;
  }
}

// Approve token spending
export async function approveTokens(spenderAddress: string, amount: string): Promise<string> {
  try {
    const signer = await getSigner();
    const tokenContract = new ethers.Contract(tokenInfo.contractAddress, tokenAbi, signer);
    
    const tx = await tokenContract.approve(spenderAddress, ethers.parseUnits(amount, 18));
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error("Error approving tokens:", error);
    throw error;
  }
}
