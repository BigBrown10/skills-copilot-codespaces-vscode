import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { whatsappWebhookRouter } from './whatsapp/webhook';
import { telegramWebhookRouter } from './telegram/webhook';
import { messageQueue } from './queue/message-processor';

dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_HANDLER_PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'webhook-handler',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'B2B Chatbot Webhook Handler',
    version: '1.0.0',
    endpoints: {
      whatsapp: '/webhook/whatsapp',
      telegram: '/webhook/telegram',
      health: '/health',
    },
  });
});

// Webhook routes
app.use('/webhook/whatsapp', whatsappWebhookRouter);
app.use('/webhook/telegram', telegramWebhookRouter);

// Queue monitoring endpoint
app.get('/queue/stats', async (req, res) => {
  try {
    const jobCounts = await messageQueue.getJobCounts();
    res.json({
      queue: 'message-processing',
      ...jobCounts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get queue stats' });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook Handler running on port ${PORT}`);
  console.log(`📍 WhatsApp webhook: http://localhost:${PORT}/webhook/whatsapp`);
  console.log(`📍 Telegram webhook: http://localhost:${PORT}/webhook/telegram`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await messageQueue.close();
  process.exit(0);
});
