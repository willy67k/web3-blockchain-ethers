import { Controller, Post, Body } from "@nestjs/common";
import { TransferService } from "./transfer.service.js";
import { TransferDto } from "./dto/transfer.dto.js";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("transfer")
@Controller("transfer")
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @ApiOperation({ summary: "Send ETH or ERC-20 tokens" })
  @ApiResponse({ status: 201, description: "Transaction submitted" })
  async transfer(@Body() transferDto: TransferDto) {
    return this.transferService.sendTransaction(transferDto);
  }
}
