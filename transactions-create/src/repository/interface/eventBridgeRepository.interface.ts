export default interface EventBridgeRepositoryInterface {
  push<T>(data: T, source: string, eventBusName: string, detailType: string): Promise<void>
}
