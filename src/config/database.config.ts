import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
  dbName: process.env.MONGODB_DB,
}));
