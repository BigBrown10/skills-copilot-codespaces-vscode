import { Router, Request, Response } from 'express'
import { verifyWhatsAppWebhook } from '../middleware/verify-webhook'
import { messageQueue } from '../queue/message-processor'

const router = Router()

// Webhook verification (for Meta setup)
router.get('/', (req: Request, res: Response) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified')
    res.status(200).send(challenge)
  } else {
    res.status(403).send('Forbidden')
  }
})

// Handle incoming messages
router.post('/', verifyWhatsAppWebhook, async (req: Request, res: Response) => {
  try {
    const body = req.body

    // Check if it's a message event
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0]
      const change = entry?.changes?.[0]
      const value = change?.value

      if (value?.messages) {
        const message = value.messages[0]
        const from = message.from
        const text = message.text?.body || ''

        console.log(`Received WhatsApp message from ${from}: ${text}`)

        // Queue message for processing
        await messageQueue.add('process-message', {
          platform: 'whatsapp',
          userId: from,
          message: text,
          conversationId: `whatsapp_${from}`,
          metadata: {
            messageId: message.id,
            timestamp: message.timestamp,
          },
        })
      }
    }

    res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('Error processing WhatsApp webhook:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
