import axios from 'axios';
import { ConversationRequest, ConversationResponse } from '../types';

const CONVERSATION_ENGINE_URL = process.env.CONVERSATION_ENGINE_URL || 'http://localhost:8000';

export async function processConversation(
  request: ConversationRequest
): Promise<ConversationResponse> {
  try {
    const response = await axios.post<ConversationResponse>(
      `${CONVERSATION_ENGINE_URL}/conversation`,
      request,
      {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error calling conversation engine:', error.response?.data || error.message);
    
    if (error.response?.status === 503) {
      throw new Error('Conversation engine is unavailable');
    }
    
    throw error;
  }
}

export async function endConversation(conversationId: string): Promise<void> {
  try {
    await axios.post(
      `${CONVERSATION_ENGINE_URL}/conversation/${conversationId}/end`,
      {},
      {
        timeout: 5000,
      }
    );

    console.log(`Ended conversation ${conversationId}`);
  } catch (error: any) {
    console.error('Error ending conversation:', error.response?.data || error.message);
    throw error;
  }
}

export async function getConversationContext(conversationId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${CONVERSATION_ENGINE_URL}/conversation/${conversationId}/context`,
      {
        timeout: 5000,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error getting conversation context:', error.response?.data || error.message);
    throw error;
  }
}

export async function checkConversationEngineHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${CONVERSATION_ENGINE_URL}/health`, {
      timeout: 5000,
    });

    return response.data.status === 'healthy';
  } catch (error) {
    console.error('Conversation engine health check failed');
    return false;
  }
}
