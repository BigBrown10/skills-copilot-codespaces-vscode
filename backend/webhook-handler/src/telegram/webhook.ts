import express from 'express';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { TelegramWebhookPayload } from '../types';
import { sendTelegramMessage } from './send-message';
import { messageQueue } from '../queue/message-processor';

// Rate limiter for Telegram webhooks
const telegramLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const telegramWebhookRouter = express.Router();

// Verify Telegram webhook signature
function verifyTelegramSignature(req: express.Request): boolean {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if no secret set

  const signature = req.headers['x-telegram-bot-api-secret-token'] as string;
  return signature === secret;
}

// Telegram webhook endpoint (with rate limiting)
telegramWebhookRouter.post('/', telegramLimiter, async (req, res) => {
  try {
    // Verify webhook signature
    if (!verifyTelegramSignature(req)) {
      console.warn('Invalid Telegram webhook signature');
      return res.sendStatus(403);
    }

    const payload: TelegramWebhookPayload = req.body;

    // Always respond quickly to Telegram
    res.sendStatus(200);

    // Process message
    if (payload.message?.text) {
      const userId = payload.message.from.id.toString();
      const chatId = payload.message.chat.id.toString();
      const messageText = payload.message.text;
      const username = payload.message.from.username || payload.message.from.first_name;

      console.log(`Received Telegram message from ${username}: ${messageText}`);

      // Add to processing queue
      await messageQueue.add('process-message', {
        platform: 'telegram',
        userId,
        message: messageText,
        conversationId: `telegram_${chatId}`,
        metadata: {
          chatId,
          messageId: payload.message.message_id,
          username,
          firstName: payload.message.from.first_name,
          lastName: payload.message.from.last_name,
        },
      });
    }
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    // Don't throw error - we already responded to Telegram
  }
});

// Set webhook (for setup/testing)
telegramWebhookRouter.post('/setup', async (req, res) => {
  try {
    const { webhookUrl } = req.body;
    
    if (!webhookUrl) {
      return res.status(400).json({ error: 'webhookUrl is required' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

    const url = `https://api.telegram.org/bot${botToken}/setWebhook`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: secret,
        allowed_updates: ['message'],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error setting up Telegram webhook:', error);
    res.status(500).json({ error: 'Failed to set up webhook' });
  }
});

// Get webhook info
telegramWebhookRouter.get('/info', async (req, res) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/bot${botToken}/getWebhookInfo`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Error getting webhook info:', error);
    res.status(500).json({ error: 'Failed to get webhook info' });
  }
});

export default telegramWebhookRouter;
