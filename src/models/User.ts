import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { URL } from './URL';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @OneToMany(() => URL, (url) => url.user)
  urls!: URL[];

  @CreateDateColumn()
  createdAt!: Date;
}
