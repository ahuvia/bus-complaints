import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, ILike, FindOptionsWhere } from "typeorm";
import { Complaint } from "../database/entities/complaint.entity";
import { ComplaintResponse } from "../database/entities/complaint-response.entity";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";
import { FilterComplaintDto } from "./dto/filter-complaint.dto";
import { AddResponseDto } from "./dto/add-response.dto";
import { ComplaintStatus } from "../database/enums/complaint.enums";
import { UserRole } from "../database/enums/user-role.enum";
import { JwtPayload } from "../auth/auth.service";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ComplaintsService {
  private readonly logger = new Logger(ComplaintsService.name);

  constructor(
    @InjectRepository(Complaint)
    private readonly complaintsRepo: Repository<Complaint>,
    @InjectRepository(ComplaintResponse)
    private readonly responsesRepo: Repository<ComplaintResponse>,
  ) {}

  async create(
    dto: CreateComplaintDto,
    userId: string,
    filePath?: string,
    originalFileName?: string,
  ): Promise<Complaint> {
    const complaint = this.complaintsRepo.create({
      ...dto,
      userId,
      filePath: filePath ?? null,
      originalFileName: originalFileName ?? null,
    });
    const saved = await this.complaintsRepo.save(complaint);
    this.logger.log(`Complaint created: ${saved.id} by user ${userId}`);
    return saved;
  }

  async findAll(
    filter: FilterComplaintDto,
    currentUser: JwtPayload,
  ): Promise<PaginatedResult<Complaint>> {
    const {
      busLine,
      direction,
      status,
      category,
      dateFrom,
      dateTo,
      search,
      page = 1,
      limit = 20,
    } = filter;

    const where: FindOptionsWhere<Complaint> = {};

    // Non-admin users only see their own complaints
    if (currentUser.role !== UserRole.ADMIN) {
      where.userId = currentUser.sub;
    }

    if (busLine) where.busLine = ILike(`%${busLine}%`);
    if (direction) where.direction = direction;
    if (status) where.status = status;
    if (category) where.category = category;

    if (dateFrom && dateTo) {
      where.incidentDate = Between(dateFrom, dateTo) as unknown as string;
    } else if (dateFrom) {
      where.incidentDate = Between(dateFrom, "9999-12-31") as unknown as string;
    } else if (dateTo) {
      where.incidentDate = Between("0000-01-01", dateTo) as unknown as string;
    }

    const [data, total] = await this.complaintsRepo.findAndCount({
      where,
      relations: ["user", "response"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Additional keyword search on notes if provided
    const filtered = search
      ? data.filter(
          (c) =>
            c.busLine.toLowerCase().includes(search.toLowerCase()) ||
            (c.notes ?? "").toLowerCase().includes(search.toLowerCase()),
        )
      : data;

    return {
      data: filtered,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, currentUser: JwtPayload): Promise<Complaint> {
    const complaint = await this.complaintsRepo.findOne({
      where: { id },
      relations: ["user", "response"],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint ${id} not found`);
    }

    if (
      currentUser.role !== UserRole.ADMIN &&
      complaint.userId !== currentUser.sub
    ) {
      throw new ForbiddenException("Access denied");
    }

    return complaint;
  }

  async update(id: string, dto: UpdateComplaintDto): Promise<Complaint> {
    const complaint = await this.complaintsRepo.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException(`Complaint ${id} not found`);

    Object.assign(complaint, dto);
    return this.complaintsRepo.save(complaint);
  }

  async remove(id: string): Promise<void> {
    const complaint = await this.complaintsRepo.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException(`Complaint ${id} not found`);
    await this.complaintsRepo.remove(complaint);
    this.logger.log(`Complaint ${id} deleted`);
  }

  async addResponse(
    id: string,
    dto: AddResponseDto,
    currentUser: JwtPayload,
    filePath?: string,
    originalFileName?: string,
  ): Promise<Complaint> {
    const complaint = await this.findOne(id, currentUser);

    if (complaint.response) {
      throw new BadRequestException(
        "Response already exists for this complaint",
      );
    }

    const response = this.responsesRepo.create({
      complaintId: id,
      filePath: filePath ?? null,
      originalFileName: originalFileName ?? null,
      note: dto.note ?? null,
    });

    await this.responsesRepo.save(response);

    complaint.status = ComplaintStatus.RESOLVED;
    return this.complaintsRepo.save(complaint);
  }
}
