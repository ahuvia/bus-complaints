import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from "@nestjs/common";
import { existsSync } from "fs";
import { join } from "path";

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly uploadsDir = process.env.UPLOADS_DIR ?? "uploads";

  resolveFilePath(folder: string, filename: string): string {
    // Sanitize inputs to prevent path traversal
    const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "");
    const safeFilename = filename.replace(/[^a-z0-9._-]/gi, "");

    if (!safeFolder || !safeFilename) {
      throw new ForbiddenException("Invalid file path");
    }

    const filePath = join(
      process.cwd(),
      this.uploadsDir,
      safeFolder,
      safeFilename,
    );

    if (!existsSync(filePath)) {
      throw new NotFoundException("File not found");
    }

    return filePath;
  }
}
