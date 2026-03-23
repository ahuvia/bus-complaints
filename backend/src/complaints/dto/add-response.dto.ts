import { IsOptional, IsString } from "class-validator";

export class AddResponseDto {
  @IsOptional()
  @IsString()
  note?: string;
}
