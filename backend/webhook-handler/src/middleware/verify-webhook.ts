import { Request } from 'express';
import crypto from 'crypto';

export function verifyWhatsAppWebhook(req: Request): boolean {
  try {
    // WhatsApp sends a signature in the X-Hub-Signature-256 header
    const signature = req.headers['x-hub-signature-256'] as string;
    
    if (!signature) {
      console.warn('No signature provided in WhatsApp webhook');
      return true; // Allow for development - remove in production
    }

    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (!appSecret) {
      console.warn('WHATSAPP_APP_SECRET not configured');
      return true; // Allow for development - remove in production
    }

    // Calculate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    const signatureHash = signature.split('sha256=')[1];

    return crypto.timingSafeEqual(
      Buffer.from(signatureHash, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error verifying WhatsApp webhook:', error);
    return false;
  }
}

export function verifyTelegramWebhook(req: Request): boolean {
  try {
    const secretToken = req.headers['x-telegram-bot-api-secret-token'] as string;
    const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (!expectedToken) {
      console.warn('TELEGRAM_WEBHOOK_SECRET not configured');
      return true; // Allow for development - remove in production
    }

    if (!secretToken) {
      console.warn('No secret token provided in Telegram webhook');
      return false;
    }

    return secretToken === expectedToken;
  } catch (error) {
    console.error('Error verifying Telegram webhook:', error);
    return false;
  }
}
