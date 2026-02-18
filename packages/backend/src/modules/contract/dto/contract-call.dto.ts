import { IsString, IsArray, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ContractCallDto {
  @ApiProperty({ description: "Target contract address" })
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty({ description: "Contract ABI (JSON string)" })
  @IsString()
  @IsNotEmpty()
  abi: string;

  @ApiProperty({ description: "Method name to call" })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: "Arguments for the method", isArray: true })
  @IsArray()
  args: any[];

  @ApiProperty({ description: "Private key of the signer" })
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
