import { EventTransactions } from '../shared/types'
import { EventsTransactionsRepositoryInterface } from '../repository/interface/eventsTransactionsRepository.interface '

export class EventsTransactionsCore {
  constructor(private repository: EventsTransactionsRepositoryInterface) {}

  async execute(eventTransaction: EventTransactions) {
    console.info('init events service')
    const timestamp = Date.now()
    const ttl = ~~(timestamp / 1000 + 20 + 60)
    await this.repository.create({
      eventType: eventTransaction.eventType,
      infoTransaction: eventTransaction.infoTransaction,
      origin: eventTransaction.origin,
      requestId: eventTransaction.requestId,
      transactionId: eventTransaction.transactionId,
      typeRequest: eventTransaction.typeRequest,
      ttl,
      pk: `#transaction_${eventTransaction.transactionId}`,
      sk: `${eventTransaction.eventType}#${timestamp}`,
    })
    // if (eventTransaction.typeRequest === 'CREATE') {

    // }
    // if (eventTransaction.typeRequest === 'UPDATE') {
    // }
  }
}
