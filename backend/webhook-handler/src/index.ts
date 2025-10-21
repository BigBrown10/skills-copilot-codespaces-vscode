import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import whatsappWebhook from './whatsapp/webhook';
import telegramWebhook from './telegram/webhook';

dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_HANDLER_PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'webhook-handler' });
});

// WhatsApp webhook routes
app.use('/webhook/whatsapp', whatsappWebhook);

// Telegram webhook routes
app.use('/webhook/telegram', telegramWebhook);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Webhook handler running on port ${PORT}`);
  console.log(`WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`Telegram webhook: http://localhost:${PORT}/webhook/telegram`);
});

export default app;
