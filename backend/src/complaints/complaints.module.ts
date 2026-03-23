import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Complaint } from "../database/entities/complaint.entity";
import { ComplaintResponse } from "../database/entities/complaint-response.entity";
import { ComplaintsController } from "./complaints.controller";
import { ComplaintsService } from "./complaints.service";

@Module({
  imports: [TypeOrmModule.forFeature([Complaint, ComplaintResponse])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {}
