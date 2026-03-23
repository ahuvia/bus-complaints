import {
  IsEnum,
  IsString,
  IsDateString,
  IsOptional,
  Matches,
  MinLength,
} from "class-validator";
import { ComplaintDirection } from "../../database/enums/complaint.enums";

export class CreateComplaintDto {
  @IsString()
  @MinLength(1)
  busLine: string;

  @IsEnum(ComplaintDirection)
  direction: ComplaintDirection;

  @IsDateString()
  incidentDate: string;

  @Matches(/^([0-1]\d|2[0-3]):[0-5]\d$/, {
    message: "incidentTime must be HH:MM",
  })
  incidentTime: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
