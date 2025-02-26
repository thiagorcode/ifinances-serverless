import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import EventBridgeRepositoryInterface from './interface/eventBridgeRepository.interface'

export class EventBridgeRepository implements EventBridgeRepositoryInterface {
  private client: EventBridgeClient

  constructor() {
    this.client = new EventBridgeClient()
  }

  async push<T>(data: T, source: string, eventBusName: string, detailType: string): Promise<void> {
    const command = new PutEventsCommand({
      Entries: [
        {
          Time: new Date(),
          Detail: JSON.stringify(data),
          DetailType: detailType,
          EventBusName: eventBusName,
          Source: source,
        },
      ],
    })
    console.log('send message command: ', command)
    const responseEvent = await this.client.send(command)
    console.info('response event: ', responseEvent)
  }
}
