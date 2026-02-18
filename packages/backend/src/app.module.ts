import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { DemoModule } from "./modules/demo/demo.module.js";
import { BlockchainModule } from "./modules/blockchain/blockchain.module.js";
import { BalanceModule } from "./modules/balance/balance.module.js";
import { TransferModule } from "./modules/transfer/transfer.module.js";
import { EventsModule } from "./modules/events/events.module.js";
import { ContractModule } from "./modules/contract/contract.module.js";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

@Module({
  imports: [BlockchainModule, BalanceModule, TransferModule, EventsModule, ContractModule, DemoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
