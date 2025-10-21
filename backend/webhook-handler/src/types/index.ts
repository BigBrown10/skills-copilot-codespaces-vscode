export interface MessageJob {
  platform: 'whatsapp' | 'telegram'
  userId: string
  message: string
  conversationId: string
  metadata: {
    messageId?: string
    chatId?: string
    timestamp?: number
  }
}

export interface WebhookPayload {
  object?: string
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          id: string
          from: string
          timestamp: string
          text?: {
            body: string
          }
        }>
      }
    }>
  }>
}

export interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    from: {
      id: number
      first_name: string
      username?: string
    }
    chat: {
      id: number
      type: string
    }
    date: number
    text?: string
  }
}
