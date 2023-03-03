import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Users } from '../entities/users.entity';

export const mySqlConfig: MysqlConnectionOptions = {
  name: 'default',
  type: 'mysql',
  host: process.env.DB_HOST || '192.168.0.14',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'finances',
  entities: [Users],
};
