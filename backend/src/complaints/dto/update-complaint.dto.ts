import { IsEnum, IsOptional, IsString } from "class-validator";
import {
  ComplaintCategory,
  ComplaintStatus,
} from "../../database/enums/complaint.enums";

export class UpdateComplaintDto {
  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;

  @IsOptional()
  @IsEnum(ComplaintCategory)
  category?: ComplaintCategory;

  @IsOptional()
  @IsString()
  notes?: string;
}
