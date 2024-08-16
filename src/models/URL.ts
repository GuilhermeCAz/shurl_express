import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class URL {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  originalURL!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
