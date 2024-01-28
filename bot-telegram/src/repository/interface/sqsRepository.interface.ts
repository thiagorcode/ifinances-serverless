export interface SQSRepositoryInterface {
  send<T>(data: T, queueName?: string): Promise<void>
}
