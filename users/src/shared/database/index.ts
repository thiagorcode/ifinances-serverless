import { DataSource, DataSourceOptions } from 'typeorm';
import { Users } from './entities/users.entity';

/**
 * Database manager class
 */

export class Database {
  public getConnection(): Promise<DataSource> {
    const CONNECTION_NAME = `default`;

    const connectionOptions: DataSourceOptions = {
      name: CONNECTION_NAME,
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      entities: [Users],
    };
    const connection = new DataSource(connectionOptions);
    // Logger.info(`Database.getConnection()-creating connection ...`)
    return connection.initialize();
  }
}
