export interface EventBridgeRepositoryInterface {
  push<T>(data: T, source: string, eventBusName: string): Promise<void>
}
