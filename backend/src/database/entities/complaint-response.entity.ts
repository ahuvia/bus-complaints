import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Complaint } from "./complaint.entity";

@Entity("complaint_responses")
export class ComplaintResponse {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => Complaint, (complaint) => complaint.response, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "complaintId" })
  complaint: Complaint;

  @Column()
  complaintId: string;

  @Column({ type: 'varchar', nullable: true })
  filePath: string | null;

  @Column({ type: 'varchar', nullable: true })
  originalFileName: string | null;

  @Column({ type: "text", nullable: true })
  note: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
