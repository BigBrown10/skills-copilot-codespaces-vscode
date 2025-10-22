import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function verifyWhatsAppWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // For GET requests (webhook verification)
  if (req.method === 'GET') {
    return next();
  }

  // For POST requests (webhook messages)
  // WhatsApp uses the app secret to sign requests
  const signature = req.headers['x-hub-signature-256'] as string;
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (!appSecret) {
    console.warn('WHATSAPP_APP_SECRET not set, skipping signature verification');
    return next();
  }

  if (!signature) {
    console.warn('Missing x-hub-signature-256 header');
    return next(); // Still process for development
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    const signatureHash = signature.split('sha256=')[1];

    if (crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedSignature))) {
      return next();
    } else {
      console.warn('Invalid WhatsApp webhook signature');
      res.sendStatus(403);
    }
  } catch (error) {
    console.error('Error verifying WhatsApp signature:', error);
    res.sendStatus(500);
  }
}

export function verifyTelegramWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  
  if (!secret) {
    console.warn('TELEGRAM_WEBHOOK_SECRET not set, skipping verification');
    return next();
  }

  const signature = req.headers['x-telegram-bot-api-secret-token'] as string;

  if (signature === secret) {
    return next();
  } else {
    console.warn('Invalid Telegram webhook signature');
    res.sendStatus(403);
  }
}
