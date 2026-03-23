import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";
import { SummaryService, MonthlySummary } from "./summary.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

class MonthlyQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number = new Date().getFullYear();

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number = new Date().getMonth() + 1;
}

@Controller("summary")
@UseGuards(JwtAuthGuard)
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get("monthly")
  getMonthly(@Query() query: MonthlyQueryDto): Promise<MonthlySummary> {
    return this.summaryService.getMonthlySummary(query.year, query.month);
  }
}
