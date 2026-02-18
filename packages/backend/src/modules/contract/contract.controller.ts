import { Controller, Post, Body } from "@nestjs/common";
import { ContractService } from "./contract.service.js";
import { ContractCallDto } from "./dto/contract-call.dto.js";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("contract")
@Controller("contract")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post("call")
  @ApiOperation({ summary: "Call a custom contract method" })
  @ApiResponse({ status: 201, description: "Transaction submitted" })
  async callMethod(@Body() dto: ContractCallDto) {
    return this.contractService.callMethod(dto);
  }
}
