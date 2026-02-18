import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { BlockchainService } from "../blockchain/blockchain.service.js";
import { ethers } from "ethers";
import { QueryEventsDto } from "./dto/query-events.dto.js";
import { BlockchainEvent, QueryResult } from "../../shared/interfaces/blockchain.interface.js";

@Injectable()
export class EventsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EventsService.name);
  private readonly WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
  private readonly USDT_ADDRESS = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";
  private lastBlock: number | null = null;
  private pollInterval: NodeJS.Timeout;
  private events: BlockchainEvent[] = [];

  constructor(private readonly blockchainService: BlockchainService) {}

  async onModuleInit() {
    // Get current block to start from
    try {
      this.lastBlock = await this.blockchainService.getProvider().getBlockNumber();
      this.startPolling();
    } catch (err) {
      this.logger.error("Failed to get initial block number", err);
    }
  }

  onModuleDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  getEvents(): BlockchainEvent[] {
    return this.events;
  }

  private startPolling() {
    this.logger.log(`Started polling for Transfer events on ${this.USDT_ADDRESS}`);

    this.pollInterval = setInterval(() => {
      void (async () => {
        try {
          const currentBlock = await this.blockchainService.getProvider().getBlockNumber();

          // Only query if there are new blocks
          if (this.lastBlock !== null && currentBlock > this.lastBlock) {
            const fromBlock = this.lastBlock + 1;
            const toBlock = currentBlock;

            const abi = ["event Transfer(address indexed from, address indexed to, uint256 value)"];
            const contract = new ethers.Contract(this.USDT_ADDRESS, abi, this.blockchainService.getProvider());

            const logs = await contract.queryFilter("Transfer", fromBlock, toBlock);

            for (const log of logs) {
              if (log instanceof ethers.EventLog && log.args) {
                const { from, to, value } = log.args as unknown as { from: string; to: string; value: bigint };
                const eventData: BlockchainEvent = {
                  event: "Transfer",
                  from,
                  to,
                  value: ethers.formatUnits(value, 6),
                  txHash: log.transactionHash,
                  timestamp: new Date().toISOString(),
                };

                this.logger.log(`New Event: ${eventData.txHash}`);
                this.events.unshift(eventData);
              }
            }

            if (this.events.length > 50) {
              this.events = this.events.slice(0, 50);
            }

            this.lastBlock = currentBlock;
          }
        } catch (error) {
          this.logger.error("Polling error:", error);
        }
      })();
    }, 10000); // Poll every 10 seconds
  }

  async queryEvents(query: QueryEventsDto): Promise<QueryResult[]> {
    const { address, eventName, abi, fromBlock, toBlock } = query;
    const parsedAbi = typeof abi === "string" ? JSON.parse(abi) : abi;
    const contract = new ethers.Contract(address, parsedAbi, this.blockchainService.getProvider());

    const logs = await contract.queryFilter(eventName, fromBlock || -1000, toBlock || "latest");

    return logs.map((log) => {
      const args: Record<string, string> = {};

      if (log instanceof ethers.EventLog && log.args) {
        const fragment = log.fragment;
        if (fragment && fragment.inputs) {
          fragment.inputs.forEach((input, index) => {
            const name = input.name || `arg${index}`;
            const val = log.args[index];
            args[name] = typeof val === "bigint" ? val.toString() : String(val);
          });
        }
      }

      return {
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
        args,
      };
    });
  }
}
