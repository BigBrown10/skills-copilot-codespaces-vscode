import axios from 'axios'

const CONVERSATION_ENGINE_URL =
  process.env.CONVERSATION_ENGINE_URL || 'http://localhost:8000'

export interface ConversationRequest {
  message: string
  user_id: string
  conversation_id: string
  platform: string
  metadata?: any
}

export interface ConversationResponse {
  message: {
    sender: string
    content: string
  }
  intent: {
    type: string
    confidence: number
  }
  conversation_id: string
  requires_human: boolean
}

export async function processConversation(
  request: ConversationRequest
): Promise<ConversationResponse> {
  try {
    const response = await axios.post(`${CONVERSATION_ENGINE_URL}/conversation`, request, {
      timeout: 30000,
    })

    return response.data
  } catch (error) {
    console.error('Error calling conversation engine:', error)
    throw error
  }
}
