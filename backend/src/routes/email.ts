import { Router, Response } from 'express';
import { config } from '../config';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/email/send
 * Sends a transactional email via Brevo SMTP REST API.
 * Requires authentication.
 *
 * Body:
 *   to: string (recipient email)
 *   subject: string
 *   htmlContent: string
 *   textContent?: string
 *   replyTo?: { email: string; name?: string }
 */
router.post('/send', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { to, subject, htmlContent, textContent, replyTo } = req.body;

    if (!to || !subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, htmlContent',
      });
    }

    if (config.brevo.apiKey === 'YOUR_BREVO_API_KEY') {
      console.warn('[Brevo] API key not configured. Skipping email send.');
      return res.status(200).json({
        success: true,
        message: 'Email skipped — Brevo API key not configured.',
        skipped: true,
      });
    }

    const payload: any = {
      sender: {
        email: config.brevo.senderEmail,
        name: config.brevo.senderName,
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    };

    if (textContent) payload.textContent = textContent;
    if (replyTo) payload.replyTo = replyTo;

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': config.brevo.apiKey,
        'accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Brevo] Email send failed:', response.status, errorText);
      return res.status(502).json({
        success: false,
        message: `Brevo API error: ${response.status}`,
      });
    }

    const result = await response.json();
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('[Brevo] Email send error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email.',
    });
  }
});

export default router;
