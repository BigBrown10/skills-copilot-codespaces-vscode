import { Router, Request, Response } from 'express'
import crypto from 'crypto'
import { messageQueue } from '../queue/message-processor'

const router = Router()

// Verify Telegram webhook signature
function verifyTelegramSignature(req: Request): boolean {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!secret) return true // Skip verification if no secret is set

  const signature = req.headers['x-telegram-bot-api-secret-token']
  return signature === secret
}

// Handle incoming updates
router.post('/', async (req: Request, res: Response) => {
  try {
    if (!verifyTelegramSignature(req)) {
      return res.status(403).json({ error: 'Invalid signature' })
    }

    const update = req.body

    // Handle message
    if (update.message) {
      const message = update.message
      const chatId = message.chat.id
      const text = message.text || ''
      const userId = message.from.id

      console.log(`Received Telegram message from ${userId}: ${text}`)

      // Queue message for processing
      await messageQueue.add('process-message', {
        platform: 'telegram',
        userId: userId.toString(),
        message: text,
        conversationId: `telegram_${chatId}`,
        metadata: {
          messageId: message.message_id,
          chatId,
          timestamp: message.date,
        },
      })
    }

    res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('Error processing Telegram webhook:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
