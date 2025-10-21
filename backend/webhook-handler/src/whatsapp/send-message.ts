import axios from 'axios'

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0'

export async function sendWhatsAppMessage(to: string, message: string): Promise<void> {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

    await axios.post(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log(`WhatsApp message sent to ${to}`)
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    throw error
  }
}
