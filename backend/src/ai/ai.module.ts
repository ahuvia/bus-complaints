import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Complaint } from "../database/entities/complaint.entity";
import { AiController } from "./ai.controller";
import { AiAgentService } from "./ai-agent.service";
import { MockAiProvider } from "./providers/mock-ai.provider";
import { AI_PROVIDER } from "./interfaces/ai-provider.interface";
import { SummaryModule } from "../summary/summary.module";

@Module({
  imports: [TypeOrmModule.forFeature([Complaint]), SummaryModule],
  controllers: [AiController],
  providers: [
    {
      provide: AI_PROVIDER,
      useClass: MockAiProvider,
    },
    AiAgentService,
  ],
  exports: [AiAgentService],
})
export class AiModule {}
