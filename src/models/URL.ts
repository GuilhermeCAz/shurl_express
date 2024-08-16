import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class URL {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  originalURL!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'int', default: 0 })
  clickCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
