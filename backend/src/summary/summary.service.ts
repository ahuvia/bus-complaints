import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Complaint } from "../database/entities/complaint.entity";
import { ComplaintStatus } from "../database/enums/complaint.enums";

export interface DailyCount {
  date: string;
  count: number;
}

export interface MonthlySummary {
  year: number;
  month: number;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  byBusLine: Record<string, number>;
  byDirection: Record<string, number>;
  byCategory: Record<string, number>;
  dailyCounts: DailyCount[];
}

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintsRepo: Repository<Complaint>,
  ) {}

  async getMonthlySummary(
    year: number,
    month: number,
  ): Promise<MonthlySummary> {
    const firstDay = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0); // last day of month
    const lastDayStr = `${year}-${String(month).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;

    const complaints = await this.complaintsRepo.find({
      where: {
        incidentDate: Between(firstDay, lastDayStr) as unknown as string,
      },
    });

    const totalComplaints = complaints.length;
    const resolvedComplaints = complaints.filter(
      (c) => c.status === ComplaintStatus.RESOLVED,
    ).length;

    const byBusLine: Record<string, number> = {};
    const byDirection: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const dailyMap: Record<string, number> = {};

    for (const complaint of complaints) {
      byBusLine[complaint.busLine] = (byBusLine[complaint.busLine] ?? 0) + 1;
      byDirection[complaint.direction] =
        (byDirection[complaint.direction] ?? 0) + 1;
      byCategory[complaint.category] =
        (byCategory[complaint.category] ?? 0) + 1;
      dailyMap[complaint.incidentDate] =
        (dailyMap[complaint.incidentDate] ?? 0) + 1;
    }

    const dailyCounts: DailyCount[] = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      year,
      month,
      totalComplaints,
      resolvedComplaints,
      pendingComplaints: totalComplaints - resolvedComplaints,
      byBusLine,
      byDirection,
      byCategory,
      dailyCounts,
    };
  }
}
