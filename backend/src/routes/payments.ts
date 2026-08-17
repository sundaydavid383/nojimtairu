import { Router, Response } from 'express';
import { PropertyModel } from '../models/Property';
import { ActivityLogModel } from '../models/Activity';
import { config } from '../config';
import { AuthRequest, authenticate, requireStaffOrAdmin } from '../middleware/auth';
import { PaymentRecord, PaymentMode, ActionType } from '../types';

const router = Router();

router.post('/:propertyId', authenticate, requireStaffOrAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;
    const paymentInput = req.body;
    const property = await PropertyModel.findOne({ id: propertyId });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const year = new Date().getFullYear();
    const receiptNumber = `NTC/REC/${year}/${String(Math.floor(1000 + Math.random() * 9000))}`;
    const today = new Date().toISOString().split('T')[0];

    const newPaidAmount = property.paidAmount + paymentInput.amount;
    const newBalance = Math.max(0, property.totalAmount - newPaidAmount);
    let newStatus: 'paid' | 'partial' | 'pending' | 'overdue' = property.paymentStatus;
    if (newPaidAmount >= property.totalAmount) newStatus = 'paid';
    else if (newPaidAmount > 0) newStatus = 'partial';

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      propertyId,
      receiptNumber,
      amount: paymentInput.amount,
      date: today,
      paymentMode: paymentInput.paymentMode as PaymentMode,
      bankReference: paymentInput.bankReference || (paymentInput.isPayPalDemo ? `PAYPAL-DEMO-${Date.now().toString().slice(-6)}` : `REF-${Date.now().toString().slice(-8)}`),
      issuingBank: paymentInput.issuingBank || (paymentInput.paymentMode === 'PayPal (Demo)' ? 'PayPal Settlement Sandbox' : 'Zenith Bank Plc'),
      payerName: paymentInput.payerName || property.clientName,
      receivedBy: req.user!.name,
      notes: paymentInput.notes || (paymentInput.isPayPalDemo ? 'Remitted via PayPal sandbox gateway (Demo Evaluation).' : 'Payment logged and verified by firm conveyancing officer.'),
      receiptAttachmentUrl: paymentInput.receiptAttachmentUrl,
      receiptThumbnailUrl: paymentInput.receiptThumbnailUrl || paymentInput.receiptAttachmentUrl,
      receiptStatus: 'Verified & Stamped',
      balanceAfter: newBalance,
      isPayPalDemo: paymentInput.isPayPalDemo,
    };

    const updatedProperty = await PropertyModel.findOneAndUpdate(
      { id: propertyId },
      {
        $push: { payments: newPayment },
        $set: {
          paidAmount: newPaidAmount,
          balanceAmount: newBalance,
          paymentStatus: newStatus,
          lastPaymentDate: today,
          updatedAt: today,
        },
      },
      { new: true }
    );

    await ActivityLogModel.create({
      id: `act-${Date.now()}`,
      propertyId,
      propertyName: property.name,
      fileNumber: property.fileNumber,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'payment_recorded' as ActionType,
      amount: paymentInput.amount,
      description: `Recorded payment of ₦${paymentInput.amount.toLocaleString()} via ${paymentInput.paymentMode} for ${property.fileNumber} (Receipt: ${receiptNumber}). Status: ${newStatus.toUpperCase()}`,
      timestamp: 'Just now',
    });

    res.json({ success: true, data: { property: updatedProperty, payment: newPayment } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to record payment.' });
  }
});

export default router;
