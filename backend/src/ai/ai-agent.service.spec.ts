import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AiAgentService } from "./ai-agent.service";
import { Complaint } from "../database/entities/complaint.entity";
import { AI_PROVIDER } from "./interfaces/ai-provider.interface";
import { SummaryService } from "../summary/summary.service";
import {
  ComplaintDirection,
  ComplaintStatus,
  ComplaintCategory,
} from "../database/enums/complaint.enums";
import { NotFoundException } from "@nestjs/common";

const mockComplaint: Complaint = {
  id: "c1-uuid",
  busLine: "42",
  direction: ComplaintDirection.INBOUND,
  incidentDate: "2026-03-10",
  incidentTime: "08:30",
  notes: "The bus was very late today",
  filePath: null,
  originalFileName: null,
  status: ComplaintStatus.PENDING,
  category: ComplaintCategory.OTHER,
  userId: "user-uuid",
  user: {} as any,
  response: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("AiAgentService", () => {
  let service: AiAgentService;
  let complaintsRepo: any;
  let mockAiProvider: any;
  let summaryService: any;

  beforeEach(async () => {
    mockAiProvider = {
      analyze: jest.fn().mockResolvedValue({
        category: ComplaintCategory.LATE_BUS,
        confidence: 0.9,
        summary: "Late bus",
        keywords: ["late"],
      }),
      categorize: jest.fn().mockResolvedValue(ComplaintCategory.LATE_BUS),
    };

    complaintsRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    summaryService = {
      getMonthlySummary: jest.fn().mockResolvedValue({
        year: 2026,
        month: 3,
        totalComplaints: 10,
        resolvedComplaints: 4,
        pendingComplaints: 6,
        byBusLine: { "42": 5 },
        byDirection: { inbound: 7 },
        byCategory: { late_bus: 6 },
        dailyCounts: [],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiAgentService,
        { provide: AI_PROVIDER, useValue: mockAiProvider },
        { provide: getRepositoryToken(Complaint), useValue: complaintsRepo },
        { provide: SummaryService, useValue: summaryService },
      ],
    }).compile();

    service = module.get<AiAgentService>(AiAgentService);
  });

  describe("analyzeComplaint", () => {
    it("should analyze complaint and update its category", async () => {
      complaintsRepo.findOne.mockResolvedValue({ ...mockComplaint });
      complaintsRepo.save.mockResolvedValue({
        ...mockComplaint,
        category: ComplaintCategory.LATE_BUS,
      });

      const result = await service.analyzeComplaint("c1-uuid");

      expect(mockAiProvider.analyze).toHaveBeenCalled();
      expect(complaintsRepo.save).toHaveBeenCalled();
      expect(result.category).toBe(ComplaintCategory.LATE_BUS);
    });

    it("should throw NotFoundException if complaint not found", async () => {
      complaintsRepo.findOne.mockResolvedValue(null);
      await expect(service.analyzeComplaint("bad-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("generateMonthlySummaryReport", () => {
    it("should return a formatted summary report", async () => {
      const report = await service.generateMonthlySummaryReport(2026, 3);

      expect(report.period).toBe("2026-03");
      expect(report.topBusLine).toBe("42");
      expect(report.resolutionRate).toBe("40%");
      expect(report.highlights.length).toBeGreaterThan(0);
    });
  });
});
