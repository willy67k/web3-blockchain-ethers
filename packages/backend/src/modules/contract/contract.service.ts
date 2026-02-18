import { Injectable, BadRequestException } from "@nestjs/common";
import { BlockchainService } from "../blockchain/blockchain.service.js";
import { ContractCallDto } from "./dto/contract-call.dto.js";
import { ethers } from "ethers";

@Injectable()
export class ContractService {
  constructor(private readonly blockchainService: BlockchainService) {}

  async callMethod(dto: ContractCallDto) {
    try {
      const wallet = this.blockchainService.getSigner(dto.privateKey);
      const abi = JSON.parse(dto.abi);
      const contract = new ethers.Contract(dto.contractAddress, abi, wallet);

      const tx = await contract[dto.method](...dto.args);

      return {
        txHash: tx.hash,
        status: "submitted",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
