import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ComplaintsModule } from "./complaints/complaints.module";
import { UploadsModule } from "./uploads/uploads.module";
import { SummaryModule } from "./summary/summary.module";
import { AiModule } from "./ai/ai.module";
import { User } from "./database/entities/user.entity";
import { Complaint } from "./database/entities/complaint.entity";
import { ComplaintResponse } from "./database/entities/complaint-response.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get<string>("DB_HOST", "localhost"),
        port: config.get<number>("DB_PORT", 5432),
        username: config.get<string>("DB_USER", "bususer"),
        password: config.get<string>("DB_PASS", "buspass"),
        database: config.get<string>("DB_NAME", "bus_complaints"),
        entities: [User, Complaint, ComplaintResponse],
        synchronize: config.get<string>("NODE_ENV") !== "production",
        logging: config.get<string>("NODE_ENV") === "development",
      }),
    }),
    AuthModule,
    UsersModule,
    ComplaintsModule,
    UploadsModule,
    SummaryModule,
    AiModule,
  ],
})
export class AppModule {}
