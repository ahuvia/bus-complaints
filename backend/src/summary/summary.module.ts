import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Complaint } from "../database/entities/complaint.entity";
import { SummaryController } from "./summary.controller";
import { SummaryService } from "./summary.service";

@Module({
  imports: [TypeOrmModule.forFeature([Complaint])],
  controllers: [SummaryController],
  providers: [SummaryService],
  exports: [SummaryService],
})
export class SummaryModule {}
