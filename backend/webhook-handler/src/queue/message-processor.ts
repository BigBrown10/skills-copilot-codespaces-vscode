import Queue from 'bull';
import { MessageJob } from '../types';
import { sendWhatsAppMessage } from '../whatsapp/send-message';
import { sendTelegramMessage, sendTelegramChatAction } from '../telegram/send-message';
import { processConversation } from '../services/conversation-api';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

export const messageQueue = new Queue<MessageJob>('message-processing', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD || undefined,
  },
});

// Process messages from the queue
messageQueue.process('process-message', async (job) => {
  const { platform, userId, message, conversationId, metadata } = job.data;

  try {
    console.log(`Processing ${platform} message from ${userId}`);

    // Show typing indicator for Telegram
    if (platform === 'telegram' && metadata?.chatId) {
      await sendTelegramChatAction(metadata.chatId, 'typing');
    }

    // Send message to conversation engine
    const response = await processConversation({
      conversation_id: conversationId,
      user_id: userId,
      message,
      platform,
      metadata,
    });

    console.log(`Got response from conversation engine:`, response.response);

    // Send response back to user
    if (platform === 'whatsapp') {
      await sendWhatsAppMessage(userId, response.response);
    } else if (platform === 'telegram' && metadata?.chatId) {
      await sendTelegramMessage(metadata.chatId, response.response);
    }

    return { success: true, response: response.response };
  } catch (error: any) {
    console.error(`Error processing message:`, error);
    
    // Send error message to user
    const errorMessage = 'Sorry, I encountered an error processing your message. Please try again.';
    
    try {
      if (platform === 'whatsapp') {
        await sendWhatsAppMessage(userId, errorMessage);
      } else if (platform === 'telegram' && metadata?.chatId) {
        await sendTelegramMessage(metadata.chatId, errorMessage);
      }
    } catch (sendError) {
      console.error('Error sending error message:', sendError);
    }

    throw error;
  }
});

// Queue event handlers
messageQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

messageQueue.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

messageQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await messageQueue.close();
});

export default messageQueue;
