import { EventTransactions } from '../shared/types'
import { EventsRepositoryInterface } from '../repository/interface/eventsRepository.interface'

export class EventsCore {
  constructor(private repository: EventsRepositoryInterface) {}

  async execute(eventTransaction: EventTransactions) {
    console.info('init events service')
    const timestamp = Date.now()
    const ttl = ~~(timestamp / 1000 + 20 + 60)
    await this.repository.create({
      eventType: eventTransaction.eventType,
      infoTransaction: eventTransaction.infoTransaction,
      origin: eventTransaction.origin,
      requestId: eventTransaction.requestId,
      bodyId: eventTransaction.bodyId,
      typeRequest: eventTransaction.typeRequest,
      ttl,
      sk: `${eventTransaction.eventType}#${timestamp}`,
      pk: `#transaction_${eventTransaction.bodyId}`,
    })

    await this.repository.create()
    // if (eventTransaction.typeRequest === 'CREATE') {

    // }
    // if (eventTransaction.typeRequest === 'UPDATE') {
    // }
  }
}
