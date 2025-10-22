import express from 'express';
import { verifyWhatsAppWebhook } from '../middleware/verify-webhook';
import { WhatsAppWebhookPayload } from '../types';
import { sendWhatsAppMessage } from './send-message';
import { messageQueue } from '../queue/message-processor';

export const whatsappWebhookRouter = express.Router();

// Webhook verification (GET) - required by Meta
whatsappWebhookRouter.get('/', verifyWhatsAppWebhook, (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook messages (POST)
whatsappWebhookRouter.post('/', async (req, res) => {
  try {
    const payload: WhatsAppWebhookPayload = req.body;

    // Always respond quickly to WhatsApp
    res.sendStatus(200);

    // Process webhook asynchronously
    if (payload.object === 'whatsapp_business_account') {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const messages = change.value.messages || [];
            
            for (const message of messages) {
              if (message.type === 'text' && message.text) {
                const userId = message.from;
                const messageText = message.text.body;
                const phoneNumberId = change.value.metadata.phone_number_id;
                
                console.log(`Received WhatsApp message from ${userId}: ${messageText}`);
                
                // Add to processing queue
                await messageQueue.add('process-message', {
                  platform: 'whatsapp',
                  userId,
                  message: messageText,
                  conversationId: `whatsapp_${userId}_${phoneNumberId}`,
                  metadata: {
                    phoneNumberId,
                    messageId: message.id,
                    timestamp: message.timestamp,
                  },
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    // Don't throw error - we already responded to WhatsApp
  }
});

// Status updates
whatsappWebhookRouter.post('/status', (req, res) => {
  console.log('WhatsApp status update:', req.body);
  res.sendStatus(200);
});

export default whatsappWebhookRouter;
