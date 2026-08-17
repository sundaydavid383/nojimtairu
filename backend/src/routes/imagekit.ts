import { Router, Response } from 'express';
import crypto from 'crypto';
import { config } from '../config';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/imagekit/auth
 * Returns a signed ImageKit upload token so the frontend can upload files
 * directly to ImageKit without exposing the private key.
 *
 * Requires authentication.
 *
 * Response:
 *   token: string (ImageKit upload token)
 *   expire: number (unix timestamp)
 *   signature: string
 */
router.post('/auth', authenticate, (req: AuthRequest, res: Response) => {
  try {
    if (config.imagekit.privateKey === 'YOUR_IMAGEKIT_PRIVATE_KEY') {
      console.warn('[ImageKit] Private key not configured. Cannot generate signed token.');
      return res.status(503).json({
        success: false,
        message: 'ImageKit is not configured on the server.',
      });
    }

    const token = `upload_${Date.now()}_${req.user?.id || 'anonymous'}`;
    const expire = Math.floor(Date.now() / 1000) + 3600; // 1 hour

    const stringToSign = `${token}${expire}`;
    const signature = crypto
      .createHmac('sha1', config.imagekit.privateKey)
      .update(stringToSign)
      .digest('hex');

    res.status(200).json({
      success: true,
      token,
      expire,
      signature,
    });
  } catch (error: any) {
    console.error('[ImageKit] Auth error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate ImageKit auth token.',
    });
  }
});

export default router;
