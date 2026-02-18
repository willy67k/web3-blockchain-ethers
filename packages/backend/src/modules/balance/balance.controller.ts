import { Controller, Get, Param } from "@nestjs/common";
import { BalanceService } from "./balance.service.js";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("balance")
@Controller("balance")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(":address")
  @ApiOperation({ summary: "Get ETH and Token balances for an address" })
  @ApiResponse({ status: 200, description: "Success" })
  async getBalance(@Param("address") address: string) {
    return this.balanceService.getBalances(address);
  }
}
