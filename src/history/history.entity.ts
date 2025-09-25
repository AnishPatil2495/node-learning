import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';
import { Prescription } from '../prescriptions/prescriptions.entity';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  patient: User;

  @ManyToOne(() => Prescription, (prescription) => prescription.history)
  prescription: Prescription;

  @Column()
  action: string;

  @Column()
  timestamp: Date;
}
