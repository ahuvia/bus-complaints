import { Injectable, Inject, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { Complaint } from "../database/entities/complaint.entity";
import {
  IAiProvider,
  AnalysisResult,
  AI_PROVIDER,
} from "./interfaces/ai-provider.interface";
import { SummaryService } from "../summary/summary.service";
import {
  generateSummaryReport,
  SummaryReport,
} from "./skills/generate-summary.skill";

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);

  constructor(
    @Inject(AI_PROVIDER) private readonly aiProvider: IAiProvider,
    @InjectRepository(Complaint)
    private readonly complaintsRepo: Repository<Complaint>,
    private readonly summaryService: SummaryService,
  ) {}

  async analyzeComplaint(complaintId: string): Promise<AnalysisResult> {
    const complaint = await this.complaintsRepo.findOne({
      where: { id: complaintId },
    });
    if (!complaint)
      throw new NotFoundException(`Complaint ${complaintId} not found`);

    const text = [
      complaint.notes ?? "",
      complaint.busLine,
      complaint.direction,
    ].join(" ");
    const result = await this.aiProvider.analyze(text);

    // Persist the detected category back
    complaint.category = result.category;
    await this.complaintsRepo.save(complaint);

    this.logger.log(`Complaint ${complaintId} analyzed → ${result.category}`);
    return result;
  }

  async categorizeBatch(): Promise<{ processed: number }> {
    const uncategorized = await this.complaintsRepo.find({
      where: { notes: IsNull() },
    });

    let processed = 0;
    for (const complaint of uncategorized) {
      const text = [complaint.busLine, complaint.direction].join(" ");
      complaint.category = await this.aiProvider.categorize(text);
      await this.complaintsRepo.save(complaint);
      processed++;
    }

    this.logger.log(
      `Batch categorization complete: ${processed} complaints processed`,
    );
    return { processed };
  }

  async generateMonthlySummaryReport(
    year: number,
    month: number,
  ): Promise<SummaryReport> {
    const data = await this.summaryService.getMonthlySummary(year, month);
    return generateSummaryReport(data);
  }
}
