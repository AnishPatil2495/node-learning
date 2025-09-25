import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Prescription } from '../prescriptions/prescriptions.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  patient: User;

  @ManyToOne(() => Prescription)
  prescription: Prescription;

  @CreateDateColumn()
  visitDate: Date;

  @Column('text')
  notes: string;
}
