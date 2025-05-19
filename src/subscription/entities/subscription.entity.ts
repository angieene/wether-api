import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Frequency {
  HOURLY = 'hourly',
  DAILY = 'daily',
}

@Entity('subscription')
export class Subscription {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', enum: Frequency, nullable: true })
  frequency: Frequency;

  @Column({ type: 'boolean', default: false })
  confirmed: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
