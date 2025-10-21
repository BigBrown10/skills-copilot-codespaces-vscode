import Queue from 'bull';
import Redis from 'ioredis';
import axios from 'axios';
import { sendWhatsAppMessage } from '../whatsapp/send-message';
import { sendTelegramMessage } from '../telegram/send-message';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const CONVERSATION_ENGINE_URL = process.env.CONVERSATION_ENGINE_URL || 'http://localhost:8000';

// Create Redis connection
const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  maxRetriesPerRequest: null,
});

// Create Bull queue
const messageQueue = new Queue('message-processing', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

interface MessageData {
  channel: 'whatsapp' | 'telegram';
  userId: string;
  messageId: string;
  content: string;
  timestamp: number;
  metadata?: any;
}

// Process messages from queue
messageQueue.process(async (job) => {
  const data: MessageData = job.data;
  console.log(`Processing message from ${data.channel} user ${data.userId}`);

  try {
    // Get or create conversation ID
    const conversationId = await getOrCreateConversation(data);

    // Send to conversation engine
    const response = await axios.post(`${CONVERSATION_ENGINE_URL}/conversation`, {
      conversation_id: conversationId,
      user_id: data.userId,
      bot_id: data.metadata?.botId || 'default-bot',
      channel: data.channel,
      message: data.content,
      metadata: data.metadata,
    });

    const aiResponse = response.data.response;

    // Send response back to user
    if (data.channel === 'whatsapp') {
      await sendWhatsAppMessage(data.userId, aiResponse);
    } else if (data.channel === 'telegram') {
      const chatId = data.metadata?.chatId;
      if (chatId) {
        await sendTelegramMessage(chatId, aiResponse);
      }
    }

    console.log(`Response sent to ${data.channel} user ${data.userId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error processing message:', error.message);
    throw error;
  }
});

// Handle queue events
messageQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

messageQueue.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

// Helper function to get or create conversation
async function getOrCreateConversation(data: MessageData): Promise<string> {
  const key = `conversation:${data.channel}:${data.userId}`;
  let conversationId = await redisClient.get(key);

  if (!conversationId) {
    // Generate new conversation ID
    conversationId = `${data.channel}-${data.userId}-${Date.now()}`;
    
    // Store for 24 hours
    await redisClient.setex(key, 86400, conversationId);
  }

  return conversationId;
}

// Export function to add messages to queue
export async function processMessage(data: MessageData): Promise<void> {
  await messageQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
}

export default messageQueue;
