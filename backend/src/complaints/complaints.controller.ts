import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ComplaintsService, PaginatedResult } from "./complaints.service";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";
import { FilterComplaintDto } from "./dto/filter-complaint.dto";
import { AddResponseDto } from "./dto/add-response.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../auth/current-user.decorator";
import { UserRole } from "../database/enums/user-role.enum";
import { JwtPayload } from "../auth/auth.service";
import { Complaint } from "../database/entities/complaint.entity";
import {
  multerComplaintsStorage,
  multerFileFilter,
} from "../uploads/multer.config";

@Controller("complaints")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multerComplaintsStorage,
      fileFilter: multerFileFilter,
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE_MB ?? "10") * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() dto: CreateComplaintDto,
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Complaint> {
    return this.complaintsService.create(
      dto,
      user.sub,
      file?.path,
      file?.originalname,
    );
  }

  @Get()
  findAll(
    @Query() filter: FilterComplaintDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<PaginatedResult<Complaint>> {
    return this.complaintsService.findAll(filter, user);
  }

  @Get(":id")
  findOne(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<Complaint> {
    return this.complaintsService.findOne(id, user);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateComplaintDto,
  ): Promise<Complaint> {
    return this.complaintsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.complaintsService.remove(id);
  }

  @Post(":id/response")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: multerComplaintsStorage,
      fileFilter: multerFileFilter,
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE_MB ?? "10") * 1024 * 1024,
      },
    }),
  )
  addResponse(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: AddResponseDto,
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Complaint> {
    return this.complaintsService.addResponse(
      id,
      dto,
      user,
      file?.path,
      file?.originalname,
    );
  }
}
