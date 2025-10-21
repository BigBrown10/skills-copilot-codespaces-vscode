import express, { Request, Response } from 'express';
import { verifyWhatsAppWebhook } from '../middleware/verify-webhook';
import { processMessage } from '../queue/message-processor';
import { sendWhatsAppMessage } from './send-message';

const router = express.Router();

// WhatsApp webhook verification (GET)
router.get('/', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    console.error('WhatsApp webhook verification failed');
    res.sendStatus(403);
  }
});

// WhatsApp webhook events (POST)
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Verify webhook signature
    if (!verifyWhatsAppWebhook(req)) {
      return res.sendStatus(403);
    }

    // Quick response to acknowledge receipt
    res.sendStatus(200);

    // Process webhook payload
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];

        for (const change of changes) {
          if (change.field === 'messages') {
            const value = change.value;
            const messages = value.messages || [];

            for (const message of messages) {
              const from = message.from; // Phone number
              const messageId = message.id;
              const messageBody = message.text?.body || '';
              const timestamp = message.timestamp;

              console.log(`Received WhatsApp message from ${from}: ${messageBody}`);

              // Queue message for processing
              await processMessage({
                channel: 'whatsapp',
                userId: from,
                messageId,
                content: messageBody,
                timestamp,
                metadata: {
                  whatsappMessageId: messageId,
                },
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error);
    // Still return 200 to prevent retries
  }
});

export default router;
