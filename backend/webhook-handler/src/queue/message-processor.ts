import Queue from 'bull'
import Redis from 'ioredis'
import { processConversation } from '../services/conversation-api'
import { sendWhatsAppMessage } from '../whatsapp/send-message'
import { sendTelegramMessage } from '../telegram/send-message'
import { MessageJob } from '../types'

// Create Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
})

// Create message queue
export const messageQueue = new Queue('message-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
})

// Process messages
messageQueue.process('process-message', async (job) => {
  const { platform, userId, message, conversationId, metadata } = job.data as MessageJob

  try {
    console.log(`Processing message for ${platform} user ${userId}`)

    // Call conversation engine
    const response = await processConversation({
      message,
      user_id: userId,
      conversation_id: conversationId,
      platform,
      metadata,
    })

    // Send response based on platform
    if (platform === 'whatsapp') {
      await sendWhatsAppMessage(userId, response.message.content)
    } else if (platform === 'telegram') {
      const chatId = metadata.chatId
      await sendTelegramMessage(chatId, response.message.content)
    }

    console.log(`Message processed successfully for ${platform} user ${userId}`)
  } catch (error) {
    console.error(`Error processing message for ${platform} user ${userId}:`, error)
    throw error // Will trigger retry
  }
})

// Queue event handlers
messageQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

messageQueue.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

messageQueue.on('error', (error) => {
  console.error('Queue error:', error)
})
