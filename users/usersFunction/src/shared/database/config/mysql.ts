import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Users } from '../entities/users.entity';

export const mySqlConfig: MysqlConnectionOptions = {
  name: 'default',
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [Users],
};
