import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import {
  ComplaintCategory,
  ComplaintDirection,
  ComplaintStatus,
} from "../../database/enums/complaint.enums";

export class FilterComplaintDto {
  @IsOptional()
  @IsString()
  busLine?: string;

  @IsOptional()
  @IsEnum(ComplaintDirection)
  direction?: ComplaintDirection;

  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;

  @IsOptional()
  @IsEnum(ComplaintCategory)
  category?: ComplaintCategory;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
