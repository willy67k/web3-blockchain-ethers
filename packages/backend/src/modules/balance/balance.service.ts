import { Injectable } from "@nestjs/common";
import { BlockchainService } from "../blockchain/blockchain.service.js";

@Injectable()
export class BalanceService {
  private readonly SAMPLE_TOKENS = [
    "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // WETH on Sepolia
    "0x779877A7B0D9E8603169DdbD7836e478b4624789", // LINK on Sepolia
    "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0", // USDT on Sepolia
  ];

  constructor(private readonly blockchainService: BlockchainService) {}

  async getBalances(address: string) {
    const ethBalance = await this.blockchainService.getBalance(address);

    const tokenBalances = await Promise.all(
      this.SAMPLE_TOKENS.map(async (tokenAddress) => {
        const symbol = await this.blockchainService.getTokenSymbol(tokenAddress);
        const balance = await this.blockchainService.getTokenBalance(tokenAddress, address);
        return { symbol, balance };
      })
    );

    return {
      address,
      ethBalance,
      tokens: tokenBalances,
    };
  }
}
