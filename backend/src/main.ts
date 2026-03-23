import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  });

  // Serve static uploads — additional auth done at the controller level
  app.useStaticAssets(
    join(process.cwd(), process.env.UPLOADS_DIR ?? "uploads"),
    {
      prefix: "/static",
    },
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(
    `🚌 Bus Complaints API running on http://localhost:${port}`,
    "Bootstrap",
  );
}

bootstrap();
