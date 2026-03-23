import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";
import { AiAgentService } from "./ai-agent.service";
import { AnalysisResult } from "./interfaces/ai-provider.interface";
import { SummaryReport } from "./skills/generate-summary.skill";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "../database/enums/user-role.enum";

class SummaryQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year: number = new Date().getFullYear();

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number = new Date().getMonth() + 1;
}

@Controller("ai")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AiController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post("analyze/:id")
  analyze(@Param("id", ParseUUIDPipe) id: string): Promise<AnalysisResult> {
    return this.aiAgentService.analyzeComplaint(id);
  }

  @Post("categorize-batch")
  categorizeBatch(): Promise<{ processed: number }> {
    return this.aiAgentService.categorizeBatch();
  }

  @Get("summary")
  getMonthlySummary(@Query() query: SummaryQueryDto): Promise<SummaryReport> {
    return this.aiAgentService.generateMonthlySummaryReport(
      query.year,
      query.month,
    );
  }
}
