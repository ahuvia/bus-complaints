import { DataSource } from "typeorm";
import { config } from "dotenv";
import { join } from "path";
import { User } from "../database/entities/user.entity";
import { Complaint } from "../database/entities/complaint.entity";
import { ComplaintResponse } from "../database/entities/complaint-response.entity";

config(); // load .env

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "5432"),
  username: process.env.DB_USER ?? "bususer",
  password: process.env.DB_PASS ?? "buspass",
  database: process.env.DB_NAME ?? "bus_complaints",
  entities: [User, Complaint, ComplaintResponse],
  migrations: [join(__dirname, "../database/migrations/**/*{.ts,.js}")],
  synchronize: false,
});
