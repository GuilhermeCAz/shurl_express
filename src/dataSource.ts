import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/models/*.ts'],
  synchronize: true,
});

export const connectDatabase = async () => {
  try {
    await appDataSource.initialize();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
};
