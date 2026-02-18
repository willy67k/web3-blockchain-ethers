import { IsString, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class QueryEventsDto {
  @ApiProperty({ description: "Contract address to query", example: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0" })
  @IsString()
  address: string;

  @ApiProperty({ description: "Event name", example: "Transfer" })
  @IsString()
  eventName: string;

  @ApiProperty({ description: "Event ABI (partial)", example: '["event Transfer(address indexed from, address indexed to, uint256 value)"]' })
  @IsString()
  abi: string;

  @ApiProperty({ description: "Starting block", required: false, example: -100 })
  @IsOptional()
  fromBlock?: string | number;

  @ApiProperty({ description: "Ending block", required: false, example: "latest" })
  @IsOptional()
  toBlock?: string | number;
}
