import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { UploadsService } from "./uploads.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("uploads")
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get(":folder/:filename")
  serveFile(
    @Param("folder") folder: string,
    @Param("filename") filename: string,
    @Res() res: Response,
  ): void {
    const filePath = this.uploadsService.resolveFilePath(folder, filename);
    res.sendFile(filePath);
  }
}
