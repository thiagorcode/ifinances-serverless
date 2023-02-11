import { configDataBase } from './config/index';
import { DataSource } from 'typeorm';

export class Database {
  dataSource: DataSource;
  constructor() {
    console.log(configDataBase('mySql'));
    this.dataSource = new DataSource(configDataBase('mySql'));
  }
  public async createConnection(): Promise<void> {
    // Logger.info(`Database.getConnection()-creating connection ...`)
    await this.dataSource.initialize();
  }
}
