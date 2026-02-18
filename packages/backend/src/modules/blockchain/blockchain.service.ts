import { Injectable, OnModuleInit } from "@nestjs/common";
import { ethers } from "ethers";

@Injectable()
export class BlockchainService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    const rpcUrl = process.env.RPC_URL || "https://rpc.ankr.com/eth_sepolia";
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  onModuleInit() {
    console.log("BlockchainService initialized");
  }

  getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getTokenBalance(tokenAddress: string, accountAddress: string): Promise<string> {
    const abi = ["function balanceOf(address owner) view returns (uint256)", "function decimals() view returns (uint8)"];
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    const [balance, decimals] = await Promise.all([contract.balanceOf(accountAddress), contract.decimals()]);
    return ethers.formatUnits(balance, decimals);
  }

  async getTokenSymbol(tokenAddress: string): Promise<string> {
    const abi = ["function symbol() view returns (string)"];
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);
    try {
      return await contract.symbol();
    } catch (e) {
      return "UNKNOWN";
    }
  }

  getSigner(privateKey: string): ethers.Wallet {
    return new ethers.Wallet(privateKey, this.provider);
  }
}
