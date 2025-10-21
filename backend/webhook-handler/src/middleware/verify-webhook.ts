import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

export function verifyWhatsAppWebhook(req: Request, res: Response, next: NextFunction) {
  // WhatsApp doesn't use signature verification by default
  // This is a placeholder for any custom verification logic
  
  // You could add IP whitelist or other security measures here
  const validIPs = process.env.WHATSAPP_WEBHOOK_IPS?.split(',') || []
  
  if (validIPs.length > 0) {
    const clientIP = req.ip || req.connection.remoteAddress
    if (clientIP && !validIPs.includes(clientIP)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
  }

  next()
}
