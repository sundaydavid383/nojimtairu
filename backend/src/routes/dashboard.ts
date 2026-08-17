import { Router, Response } from 'express';
import { PropertyModel } from '../models/Property';
import { AuthRequest, authenticate } from '../middleware/auth';
import { DashboardStats } from '../types';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const properties = await PropertyModel.find().lean();
    
    const stats: DashboardStats = {
      totalProperties: properties.length,
      fullyPaidCount: 0,
      partialCount: 0,
      pendingCount: 0,
      overdueCount: 0,
      totalValuation: 0,
      totalCollected: 0,
      totalPendingBalance: 0,
      collectionRatePercentage: 0,
    };

    for (const p of properties) {
      stats.totalValuation += p.totalAmount;
      stats.totalCollected += p.paidAmount;
      stats.totalPendingBalance += p.balanceAmount;
      if (p.paymentStatus === 'paid') stats.fullyPaidCount++;
      else if (p.paymentStatus === 'partial') stats.partialCount++;
      else if (p.paymentStatus === 'pending') stats.pendingCount++;
      else if (p.paymentStatus === 'overdue') stats.overdueCount++;
    }

    stats.collectionRatePercentage = stats.totalValuation > 0 ? (stats.totalCollected / stats.totalValuation) * 100 : 0;

    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch dashboard stats.' });
  }
});

export default router;
