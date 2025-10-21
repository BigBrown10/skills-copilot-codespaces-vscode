import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import whatsappWebhook from './whatsapp/webhook'
import telegramWebhook from './telegram/webhook'
import { messageQueue } from './queue/message-processor'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'webhook-handler',
    version: '1.0.0',
  })
})

// WhatsApp webhook routes
app.use('/webhook/whatsapp', whatsappWebhook)

// Telegram webhook routes
app.use('/webhook/telegram', telegramWebhook)

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook handler is running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  await messageQueue.close()
  process.exit(0)
})
