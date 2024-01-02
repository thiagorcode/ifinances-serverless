export type EventTelegramType = {
  channel_post?: {
    text?: string
    chat?: {
      id: string
    }
  }
  message?: {
    text?: string
    chat?: {
      id: string
    }
  }
}
