import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { BlockchainService } from "../blockchain/blockchain.service.js";
import { ethers } from "ethers";

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsService.name);
  private readonly WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
  private contract: ethers.Contract;
  private events: any[] = [];

  constructor(private readonly blockchainService: BlockchainService) {}

  onModuleInit() {
    this.startListening();
  }

  onModuleDestroy() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }

  getEvents() {
    return this.events;
  }

  private startListening() {
    const abi = ["event Transfer(address indexed from, address indexed to, uint256 value)"];
    this.contract = new ethers.Contract(this.WETH_ADDRESS, abi, this.blockchainService.getProvider());

    this.logger.log(`Started listening for Transfer events on ${this.WETH_ADDRESS}`);

    this.contract.on("Transfer", (from, to, value, event) => {
      const eventData = {
        event: "Transfer",
        from,
        to,
        value: ethers.formatUnits(value, 18),
        txHash: event.log.transactionHash,
        timestamp: new Date().toISOString(),
      };

      this.logger.log(eventData);
      this.events.unshift(eventData);
      if (this.events.length > 50) this.events.pop();
    });
  }
}
