import express, { Request, Response } from 'express';
import { processMessage } from '../queue/message-processor';
import { sendTelegramMessage } from './send-message';

const router = express.Router();

// Telegram webhook (POST)
router.post('/', async (req: Request, res: Response) => {
  try {
    const update = req.body;

    // Quick response to acknowledge receipt
    res.sendStatus(200);

    // Process message
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const userId = message.from.id;
      const username = message.from.username || message.from.first_name;
      const text = message.text || '';
      const messageId = message.message_id;

      console.log(`Received Telegram message from ${username} (${userId}): ${text}`);

      // Queue message for processing
      await processMessage({
        channel: 'telegram',
        userId: userId.toString(),
        messageId: messageId.toString(),
        content: text,
        timestamp: message.date,
        metadata: {
          chatId,
          username,
          telegramMessageId: messageId,
        },
      });
    }

    // Handle callback queries (inline keyboard buttons)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;

      console.log(`Received Telegram callback query: ${data}`);

      // Process callback data
      await processMessage({
        channel: 'telegram',
        userId: callbackQuery.from.id.toString(),
        messageId: callbackQuery.id,
        content: data,
        timestamp: Math.floor(Date.now() / 1000),
        metadata: {
          chatId,
          isCallbackQuery: true,
        },
      });
    }
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    // Still return 200 to prevent retries
  }
});

// Set webhook endpoint (for initial setup)
router.post('/set-webhook', async (req: Request, res: Response) => {
  try {
    const { webhookUrl } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    const axios = require('axios');
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
      {
        url: webhookUrl,
        allowed_updates: ['message', 'callback_query'],
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Error setting Telegram webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
