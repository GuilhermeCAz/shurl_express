import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User.js';

@Entity()
export class URL {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  originalURL!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'int', default: 0 })
  clickCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  user?: User;
}
