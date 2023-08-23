import { DynamoDB } from 'aws-sdk';
export class Database {
  readonly dynamoDb: DynamoDB.DocumentClient;
  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient({});
  }
  public async createConnection(): Promise<DynamoDB.DocumentClient> {
    // Logger.info(`Database.getConnection()-creating connection ...`)
    console.info('connection created');
    return this.dynamoDb;
  }
}
