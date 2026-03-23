import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import {
  ComplaintStatus,
  ComplaintDirection,
  ComplaintCategory,
} from "../enums/complaint.enums";
import { User } from "./user.entity";
import { ComplaintResponse } from "./complaint-response.entity";

@Entity("complaints")
export class Complaint {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  busLine: string;

  @Column({ type: "enum", enum: ComplaintDirection })
  direction: ComplaintDirection;

  @Column({ type: "date" })
  incidentDate: string;

  @Column({ type: "time" })
  incidentTime: string;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', nullable: true })
  filePath: string | null;

  @Column({ type: 'varchar', nullable: true })
  originalFileName: string | null;

  @Column({
    type: "enum",
    enum: ComplaintStatus,
    default: ComplaintStatus.PENDING,
  })
  status: ComplaintStatus;

  @Column({
    type: "enum",
    enum: ComplaintCategory,
    default: ComplaintCategory.OTHER,
  })
  category: ComplaintCategory;

  @ManyToOne(() => User, (user) => user.complaints, {
    onDelete: "CASCADE",
    eager: false,
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: string;

  @OneToOne(() => ComplaintResponse, (response) => response.complaint, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  response: ComplaintResponse | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
