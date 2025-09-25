import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contactInfo: string; // Could be an email, phone number, or websocket channel
}
