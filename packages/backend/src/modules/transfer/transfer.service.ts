import { Injectable, BadRequestException } from "@nestjs/common";
import { BlockchainService } from "../blockchain/blockchain.service.js";
import { TransferDto } from "./dto/transfer.dto.js";
import { ethers } from "ethers";

@Injectable()
export class TransferService {
  constructor(private readonly blockchainService: BlockchainService) {}

  async sendTransaction(dto: TransferDto) {
    try {
      const wallet = this.blockchainService.getSigner(dto.fromPrivateKey);

      let tx;
      if (!dto.tokenAddress) {
        // ETH Transfer
        tx = await wallet.sendTransaction({
          to: dto.to,
          value: ethers.parseEther(dto.amount),
          gasLimit: 21000, // Standard ETH transfer gas limit
        });
      } else {
        // ERC-20 Transfer
        const abi = ["function transfer(address to, uint256 amount) returns (bool)", "function decimals() view returns (uint8)"];
        const contract = new ethers.Contract(dto.tokenAddress, abi, wallet);
        const decimals = await contract.decimals();
        const amount = ethers.parseUnits(dto.amount, decimals);

        tx = await contract.transfer(dto.to, amount, {
          gasLimit: 100000, // Estimated for token transfer
        });
      }

      return {
        txHash: tx.hash,
        status: "submitted",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
