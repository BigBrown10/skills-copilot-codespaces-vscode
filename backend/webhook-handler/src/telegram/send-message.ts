import axios from 'axios'

const TELEGRAM_API_URL = 'https://api.telegram.org'

export async function sendTelegramMessage(chatId: string, message: string): Promise<void> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN

    await axios.post(`${TELEGRAM_API_URL}/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    })

    console.log(`Telegram message sent to ${chatId}`)
  } catch (error) {
    console.error('Error sending Telegram message:', error)
    throw error
  }
}
