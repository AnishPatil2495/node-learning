import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Prescription } from '../prescriptions/prescriptions.entity';
import { History } from '../history/history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;

  @OneToMany(() => Prescription, (prescription) => prescription.doctor)
  prescriptionsAsDoctor: Prescription[];

  @OneToMany(() => Prescription, (prescription) => prescription.patient)
  prescriptionsAsPatient: Prescription[];
}
