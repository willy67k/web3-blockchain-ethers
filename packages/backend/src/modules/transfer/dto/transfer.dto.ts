import { IsString, IsOptional, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TransferDto {
  @ApiProperty({ description: "Private key of the sender" })
  @IsString()
  @IsNotEmpty()
  fromPrivateKey: string;

  @ApiProperty({ description: "Recipient address" })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: "Amount to transfer" })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ description: "Token address (null for ETH)", required: false })
  @IsString()
  @IsOptional()
  tokenAddress?: string;
}
