import axios from 'axios';

const TELEGRAM_API_URL = 'https://api.telegram.org';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(
  chatId: string | number,
  message: string,
  options?: {
    parseMode?: 'Markdown' | 'HTML';
    disableWebPagePreview?: boolean;
    replyToMessageId?: number;
  }
): Promise<void> {
  try {
    const url = `${TELEGRAM_API_URL}/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: options?.parseMode,
      disable_web_page_preview: options?.disableWebPagePreview,
      reply_to_message_id: options?.replyToMessageId,
    });

    console.log(`Telegram message sent to ${chatId}:`, response.data);
  } catch (error: any) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    throw error;
  }
}

export async function sendTelegramPhoto(
  chatId: string | number,
  photoUrl: string,
  caption?: string
): Promise<void> {
  try {
    const url = `${TELEGRAM_API_URL}/bot${BOT_TOKEN}/sendPhoto`;
    
    const response = await axios.post(url, {
      chat_id: chatId,
      photo: photoUrl,
      caption,
    });

    console.log(`Telegram photo sent to ${chatId}:`, response.data);
  } catch (error: any) {
    console.error('Error sending Telegram photo:', error.response?.data || error.message);
    throw error;
  }
}

export async function sendTelegramDocument(
  chatId: string | number,
  documentUrl: string,
  caption?: string
): Promise<void> {
  try {
    const url = `${TELEGRAM_API_URL}/bot${BOT_TOKEN}/sendDocument`;
    
    const response = await axios.post(url, {
      chat_id: chatId,
      document: documentUrl,
      caption,
    });

    console.log(`Telegram document sent to ${chatId}:`, response.data);
  } catch (error: any) {
    console.error('Error sending Telegram document:', error.response?.data || error.message);
    throw error;
  }
}

export async function sendTelegramChatAction(
  chatId: string | number,
  action: 'typing' | 'upload_photo' | 'upload_document'
): Promise<void> {
  try {
    const url = `${TELEGRAM_API_URL}/bot${BOT_TOKEN}/sendChatAction`;
    
    await axios.post(url, {
      chat_id: chatId,
      action,
    });
  } catch (error: any) {
    console.error('Error sending Telegram chat action:', error.response?.data || error.message);
    // Don't throw - this is not critical
  }
}

export async function getTelegramMe(): Promise<any> {
  try {
    const url = `${TELEGRAM_API_URL}/bot${BOT_TOKEN}/getMe`;
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Error getting bot info:', error.response?.data || error.message);
    throw error;
  }
}
