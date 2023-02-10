import {  DataSource, DataSourceOptions } from 'typeorm'
import { Users } from './entities/users.entity'
// import { SnakeNamingStrategy } from './SnakeNamingStrategy'

/**
 * Database manager class
 */
export class Database {
  public getConnection(): Promise<DataSource> {
      const CONNECTION_NAME = `default`

      const connectionOptions: DataSourceOptions = {
        name: CONNECTION_NAME,
        type: `mysql`,
        port: 3099,
        host: 'localhost',
        username: 'root',
        password: 'root',
        entities: [
            Users
        ],
        
    }
    const connection = new DataSource(connectionOptions)
      
          // Logger.info(`Database.getConnection()-creating connection ...`)
    
    return connection.initialize()
  }
}