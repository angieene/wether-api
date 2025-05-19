import { join } from 'path';

import { config } from 'dotenv-flow';
import { DataSource, DataSourceOptions } from 'typeorm';

config({ path: join(__dirname, '../') });

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10) || 3306,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [],
  migrations: ['typeorm/migrations/*.ts'],
  migrationsTableName: 'migrations_typeorm',
};

export default new DataSource(dataSourceOptions);
