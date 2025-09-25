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

  @Column({ type: 'datetime', nullable: true })
  lastNotified: Date;
}
