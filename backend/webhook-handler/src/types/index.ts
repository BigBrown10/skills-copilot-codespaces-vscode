export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: 'text' | 'image' | 'audio' | 'video' | 'document';
}

export interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: WhatsAppMessage[];
      };
      field: string;
    }>;
  }>;
}

export interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
  date: number;
  text?: string;
}

export interface TelegramWebhookPayload {
  update_id: number;
  message?: TelegramMessage;
}

export interface ConversationRequest {
  conversation_id: string;
  user_id: string;
  message: string;
  bot_config?: Record<string, any>;
  metadata?: Record<string, any>;
  platform: 'whatsapp' | 'telegram';
}

export interface ConversationResponse {
  conversation_id: string;
  response: string;
  intent?: string;
  confidence?: number;
  actions?: Array<Record<string, any>>;
  metadata?: Record<string, any>;
}

export interface MessageJob {
  platform: 'whatsapp' | 'telegram';
  userId: string;
  message: string;
  conversationId: string;
  botId?: string;
  metadata?: Record<string, any>;
}
