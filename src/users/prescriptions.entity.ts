import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { History } from '../history/history.entity';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.prescriptionsAsDoctor)
  doctor: User;

  @ManyToOne(() => User, (user) => user.prescriptionsAsPatient)
  patient: User;

  @Column()
  medication: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => History, (history) => history.prescription)
  history: History[];
}
