import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ComplaintsService } from "./complaints.service";
import { Complaint } from "../database/entities/complaint.entity";
import { ComplaintResponse } from "../database/entities/complaint-response.entity";
import {
  ComplaintStatus,
  ComplaintDirection,
  ComplaintCategory,
} from "../database/enums/complaint.enums";
import { UserRole } from "../database/enums/user-role.enum";
import { JwtPayload } from "../auth/auth.service";

const adminUser: JwtPayload = {
  sub: "admin-uuid",
  email: "admin@test.com",
  role: UserRole.ADMIN,
};

const regularUser: JwtPayload = {
  sub: "user-uuid",
  email: "user@test.com",
  role: UserRole.USER,
};

const mockComplaint: Complaint = {
  id: "c1-uuid",
  busLine: "42",
  direction: ComplaintDirection.INBOUND,
  incidentDate: "2026-03-10",
  incidentTime: "08:30",
  notes: "Bus was late",
  filePath: null,
  originalFileName: null,
  status: ComplaintStatus.PENDING,
  category: ComplaintCategory.LATE_BUS,
  userId: "user-uuid",
  user: {} as any,
  response: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ComplaintsService", () => {
  let service: ComplaintsService;
  let complaintsRepo: jest.Mocked<Repository<Complaint>>;
  let responsesRepo: jest.Mocked<Repository<ComplaintResponse>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplaintsService,
        {
          provide: getRepositoryToken(Complaint),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ComplaintResponse),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ComplaintsService>(ComplaintsService);
    complaintsRepo = module.get(getRepositoryToken(Complaint));
    responsesRepo = module.get(getRepositoryToken(ComplaintResponse));
  });

  describe("create", () => {
    it("should create a complaint and return it", async () => {
      complaintsRepo.create.mockReturnValue(mockComplaint);
      complaintsRepo.save.mockResolvedValue(mockComplaint);

      const result = await service.create(
        {
          busLine: "42",
          direction: ComplaintDirection.INBOUND,
          incidentDate: "2026-03-10",
          incidentTime: "08:30",
        },
        "user-uuid",
      );

      expect(complaintsRepo.create).toHaveBeenCalled();
      expect(complaintsRepo.save).toHaveBeenCalled();
      expect(result.id).toBe("c1-uuid");
    });
  });

  describe("findOne", () => {
    it("should return a complaint for the owner", async () => {
      complaintsRepo.findOne.mockResolvedValue(mockComplaint);

      const result = await service.findOne("c1-uuid", regularUser);
      expect(result.id).toBe("c1-uuid");
    });

    it("should throw NotFoundException if not found", async () => {
      complaintsRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne("non-existent", adminUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw ForbiddenException for non-owner non-admin", async () => {
      const otherUser: JwtPayload = { ...regularUser, sub: "other-uuid" };
      complaintsRepo.findOne.mockResolvedValue(mockComplaint);

      await expect(service.findOne("c1-uuid", otherUser)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should allow admin to view any complaint", async () => {
      complaintsRepo.findOne.mockResolvedValue(mockComplaint);
      const result = await service.findOne("c1-uuid", adminUser);
      expect(result.id).toBe("c1-uuid");
    });
  });

  describe("remove", () => {
    it("should delete a complaint", async () => {
      complaintsRepo.findOne.mockResolvedValue(mockComplaint);
      complaintsRepo.remove.mockResolvedValue(mockComplaint);

      await expect(service.remove("c1-uuid")).resolves.toBeUndefined();
      expect(complaintsRepo.remove).toHaveBeenCalledWith(mockComplaint);
    });

    it("should throw NotFoundException when deleting non-existent complaint", async () => {
      complaintsRepo.findOne.mockResolvedValue(null);
      await expect(service.remove("bad-id")).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update and return the complaint", async () => {
      const updated = { ...mockComplaint, status: ComplaintStatus.RESOLVED };
      complaintsRepo.findOne.mockResolvedValue(mockComplaint);
      complaintsRepo.save.mockResolvedValue(updated);

      const result = await service.update("c1-uuid", {
        status: ComplaintStatus.RESOLVED,
      });
      expect(result.status).toBe(ComplaintStatus.RESOLVED);
    });
  });
});
