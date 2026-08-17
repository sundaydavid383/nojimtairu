import { Router, Response } from 'express';
import { PropertyModel } from '../models/Property';
import { ActivityLogModel } from '../models/Activity';
import { config } from '../config';
import { AuthRequest, authenticate, requireStaffOrAdmin, requireAdmin } from '../middleware/auth';
import { Property, PaymentRecord, PaymentStatus, ActionType } from '../types';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const {
      search,
      status,
      type,
      sortBy = 'latest',
      page = '1',
      limit = '50',
    } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { fileNumber: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { cityState: { $regex: search, $options: 'i' } },
        { titleRef: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'all') {
      query.paymentStatus = status;
    }
    if (type && type !== 'all') {
      query.propertyType = type;
    }

    let sortOption: any = { createdAt: -1 };
    if (sortBy === 'oldest') sortOption = { createdAt: 1 };
    else if (sortBy === 'amount_high') sortOption = { totalAmount: -1 };
    else if (sortBy === 'amount_low') sortOption = { totalAmount: 1 };
    else if (sortBy === 'name') sortOption = { name: 1 };

    const properties = await PropertyModel.find(query)
      .sort(sortOption)
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string))
      .lean();

    res.json({ success: true, data: properties });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch properties.' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const property = await PropertyModel.findOne({ id: req.params.id }).lean();
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.json({ success: true, data: property });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch property.' });
  }
});

router.post('/', authenticate, requireStaffOrAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    const year = new Date().getFullYear();
    const count = (await PropertyModel.countDocuments()) + 1;
    const fileNumber = `NTC/PROP/${year}/${String(count).padStart(3, '0')}`;
    const id = `prop-${Date.now()}`;

    const totalAmount = (body.agreedPrice || 0) + (body.legalFee || (body.agreedPrice || 0) * 0.05);
    const today = new Date().toISOString().split('T')[0];

    let paidAmount = 0;
    const payments: PaymentRecord[] = [];

    if (body.initialPayment && body.initialPayment.amount > 0) {
      paidAmount = body.initialPayment.amount;
      const receiptNo = `NTC/REC/${year}/${String(Math.floor(1000 + Math.random() * 9000))}`;
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now()}`,
        propertyId: id,
        receiptNumber: receiptNo,
        amount: body.initialPayment.amount,
        date: today,
        paymentMode: body.initialPayment.paymentMode,
        bankReference: body.initialPayment.bankReference || `TRF-${Date.now().toString().slice(-8)}`,
        issuingBank: body.initialPayment.issuingBank || 'Commercial Bank',
        payerName: body.clientName,
        receivedBy: req.user!.name,
        notes: body.initialPayment.receiptNotes || 'Initial deposit paid at file opening.',
        receiptStatus: 'Verified & Stamped',
        receiptAttachmentUrl: body.initialPayment.receiptAttachmentUrl,
        receiptThumbnailUrl: body.initialPayment.receiptAttachmentUrl,
        balanceAfter: Math.max(0, totalAmount - paidAmount),
      };
      payments.push(newPayment);
    }

    let paymentStatus: PaymentStatus = 'pending';
    if (paidAmount >= totalAmount && totalAmount > 0) paymentStatus = 'paid';
    else if (paidAmount > 0) paymentStatus = 'partial';

    const newProperty: Property = {
      ...body,
      id,
      fileNumber,
      totalAmount,
      paidAmount,
      balanceAmount: Math.max(0, totalAmount - paidAmount),
      paymentStatus,
      coverImage: body.coverImage || '',
      images: body.images && body.images.length > 0 ? body.images : [body.coverImage || ''],
      payments,
      documents: body.initialDocuments || [],
      createdBy: req.user!.name,
      createdAt: today,
      updatedAt: today,
      lastPaymentDate: payments.length > 0 ? payments[0].date : undefined,
    };

    const saved = await PropertyModel.create(newProperty);

    await ActivityLogModel.create({
      id: `act-${Date.now()}`,
      propertyId: id,
      propertyName: saved.name,
      fileNumber: saved.fileNumber,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'property_created' as ActionType,
      description: `Opened file ${saved.fileNumber} for ${saved.clientName} (Valuation: ₦${totalAmount.toLocaleString()})`,
      timestamp: 'Just now',
    });

    res.status(201).json({ success: true, data: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create property.' });
  }
});

router.put('/:id', authenticate, requireStaffOrAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    const property = await PropertyModel.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const agreedPrice = updates.agreedPrice ?? property.agreedPrice;
    const legalFee = updates.legalFee ?? property.legalFee;
    const totalAmount = agreedPrice + legalFee;
    const paidAmount = updates.paidAmount ?? property.paidAmount;
    const balanceAmount = Math.max(0, totalAmount - paidAmount);

    let paymentStatus: PaymentStatus = property.paymentStatus;
    if (paidAmount >= totalAmount && totalAmount > 0) paymentStatus = 'paid';
    else if (paidAmount > 0) paymentStatus = 'partial';
    else paymentStatus = 'pending';

    const updated = await PropertyModel.findOneAndUpdate(
      { id: req.params.id },
      {
        ...updates,
        totalAmount,
        paidAmount,
        balanceAmount,
        paymentStatus: updates.paymentStatus || paymentStatus,
        updatedAt: new Date().toISOString().split('T')[0],
      },
      { new: true }
    );

    await ActivityLogModel.create({
      id: `act-${Date.now()}`,
      propertyId: property.id,
      propertyName: updated!.name,
      fileNumber: updated!.fileNumber,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'property_updated',
      description: `Updated property details for ${updated!.fileNumber}`,
      timestamp: 'Just now',
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update property.' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const property = await PropertyModel.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    await PropertyModel.deleteOne({ id: req.params.id });

    await ActivityLogModel.create({
      id: `act-${Date.now()}`,
      propertyId: property.id,
      propertyName: property.name,
      fileNumber: property.fileNumber,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'property_deleted',
      description: `Permanently removed property archive ${property.fileNumber}`,
      timestamp: 'Just now',
    });

    res.json({ success: true, message: 'Property deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete property.' });
  }
});

export default router;
