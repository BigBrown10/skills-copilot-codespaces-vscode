import axios from 'axios';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendTelegramMessage(chatId: number | string, message: string): Promise<void> {
  try {
    const url = `${TELEGRAM_API_URL}/sendMessage`;

    const data = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    };

    const response = await axios.post(url, data);
    console.log(`Telegram message sent to ${chatId}:`, response.data);
  } catch (error: any) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    throw error;
  }
}

export async function sendTelegramMessageWithButtons(
  chatId: number | string,
  message: string,
  buttons: Array<{ text: string; callback_data: string }>
): Promise<void> {
  try {
    const url = `${TELEGRAM_API_URL}/sendMessage`;

    const keyboard = {
      inline_keyboard: [
        buttons.map((btn) => ({
          text: btn.text,
          callback_data: btn.callback_data,
        })),
      ],
    };

    const data = {
      chat_id: chatId,
      text: message,
      reply_markup: keyboard,
    };

    const response = await axios.post(url, data);
    console.log(`Telegram message with buttons sent to ${chatId}:`, response.data);
  } catch (error: any) {
    console.error('Error sending Telegram message with buttons:', error.response?.data || error.message);
    throw error;
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<void> {
  try {
    const url = `${TELEGRAM_API_URL}/answerCallbackQuery`;

    const data = {
      callback_query_id: callbackQueryId,
      text: text || 'Processing...',
    };

    await axios.post(url, data);
  } catch (error: any) {
    console.error('Error answering callback query:', error.response?.data || error.message);
  }
}
