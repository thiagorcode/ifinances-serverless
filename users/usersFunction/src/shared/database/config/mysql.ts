import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Users } from '../entities/users.entity';

export const mySqlConfig: MysqlConnectionOptions = {
  name: 'default',
  type: 'mysql',
  host: process.env.DB_HOST || 'host.docker.internal:172.17.0.1',
  port: +process.env.DB_PORT! || 3099,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  entities: [Users],
};
