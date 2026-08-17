import { Router, Response } from 'express';
import { ActivityLogModel } from '../models/Activity';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { limit = '50' } = req.query;
    const activities = await ActivityLogModel.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .lean();
    res.json({ success: true, data: activities });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch activities.' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const log = req.body;
    const newLog = await ActivityLogModel.create(log);
    res.status(201).json({ success: true, data: newLog });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to log activity.' });
  }
});

export default router;
