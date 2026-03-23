import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SummaryService } from "./summary.service";
import { Complaint } from "../database/entities/complaint.entity";
import {
  ComplaintDirection,
  ComplaintStatus,
  ComplaintCategory,
} from "../database/enums/complaint.enums";

const makeComplaint = (partial: Partial<Complaint>): Complaint =>
  ({
    id: "c1",
    busLine: "42",
    direction: ComplaintDirection.INBOUND,
    incidentDate: "2026-03-10",
    incidentTime: "08:30",
    notes: null,
    filePath: null,
    originalFileName: null,
    status: ComplaintStatus.PENDING,
    category: ComplaintCategory.LATE_BUS,
    userId: "u1",
    user: {} as any,
    response: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  }) as Complaint;

describe("SummaryService", () => {
  let service: SummaryService;
  let repo: any;

  beforeEach(async () => {
    repo = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummaryService,
        { provide: getRepositoryToken(Complaint), useValue: repo },
      ],
    }).compile();

    service = module.get<SummaryService>(SummaryService);
  });

  it("should aggregate totals correctly", async () => {
    repo.find.mockResolvedValue([
      makeComplaint({
        status: ComplaintStatus.RESOLVED,
        busLine: "42",
        incidentDate: "2026-03-05",
      }),
      makeComplaint({
        status: ComplaintStatus.PENDING,
        busLine: "17",
        incidentDate: "2026-03-07",
      }),
      makeComplaint({
        status: ComplaintStatus.RESOLVED,
        busLine: "42",
        incidentDate: "2026-03-07",
      }),
    ]);

    const result = await service.getMonthlySummary(2026, 3);

    expect(result.totalComplaints).toBe(3);
    expect(result.resolvedComplaints).toBe(2);
    expect(result.pendingComplaints).toBe(1);
    expect(result.byBusLine["42"]).toBe(2);
    expect(result.byBusLine["17"]).toBe(1);
  });

  it("should return empty summary when no complaints", async () => {
    repo.find.mockResolvedValue([]);
    const result = await service.getMonthlySummary(2026, 3);

    expect(result.totalComplaints).toBe(0);
    expect(result.dailyCounts).toHaveLength(0);
  });

  it("should count daily complaints correctly", async () => {
    repo.find.mockResolvedValue([
      makeComplaint({ incidentDate: "2026-03-05" }),
      makeComplaint({ incidentDate: "2026-03-05" }),
      makeComplaint({ incidentDate: "2026-03-10" }),
    ]);

    const result = await service.getMonthlySummary(2026, 3);

    const march5 = result.dailyCounts.find((d) => d.date === "2026-03-05");
    const march10 = result.dailyCounts.find((d) => d.date === "2026-03-10");

    expect(march5?.count).toBe(2);
    expect(march10?.count).toBe(1);
  });
});
