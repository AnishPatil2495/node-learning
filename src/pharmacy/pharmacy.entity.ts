import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  notificationEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastNotified: Date;
}
