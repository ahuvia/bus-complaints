import { diskStorage } from "multer";
import { extname, join } from "path";
import { randomUUID } from "crypto";
import { BadRequestException } from "@nestjs/common";

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const uploadsDir = process.env.UPLOADS_DIR ?? "uploads";

export const multerComplaintsStorage = diskStorage({
  destination: join(process.cwd(), uploadsDir, "complaints"),
  filename: (_req, file, cb) => {
    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const multerResponsesStorage = diskStorage({
  destination: join(process.cwd(), uploadsDir, "responses"),
  filename: (_req, file, cb) => {
    const uniqueName = `${randomUUID()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const multerFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new BadRequestException("Only PDF, JPEG, and PNG files are allowed"),
      false,
    );
  }
  cb(null, true);
};
