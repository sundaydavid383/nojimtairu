import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { ActivityLogModel } from '../models/Activity';
import { config } from '../config';
import { AuthRequest, authenticate, requireAdmin } from '../middleware/auth';
import { User, UserRole, ActionType } from '../types';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const users = await UserModel.find().select('-password').lean();
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch staff.' });
  }
});

router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    const newUser = new UserModel({
      id: `user-${Date.now()}`,
      name: body.name,
      email: body.email.toLowerCase(),
      password: body.password ? await bcrypt.hash(body.password, 12) : '',
      role: (body.role as UserRole) || 'staff',
      title: body.title || 'Legal Associate',
      avatar: body.avatar || '',
      phone: body.phone || '',
      lastActive: 'Never logged in',
      permissions: body.permissions || {
        canAddProperty: true,
        canEditProperty: true,
        canDeleteProperty: false,
        canRecordPayment: true,
        canManageStaff: false,
        canExportFinancials: false,
        canViewAuditLogs: false,
      },
    });

    const saved = await newUser.save();
    const { password, ...safeUser } = saved.toObject() as any;
    res.status(201).json({ success: true, data: safeUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to add staff.' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (updates.password) {
      updates.password = await require('bcryptjs').hash(updates.password, 12);
    }

    const updated = await UserModel.findByIdAndUpdate(user._id, updates, { new: true }).select('-password');

    await ActivityLogModel.create({
      id: `act-${Date.now()}`,
      userId: req.user!.id,
      userName: req.user!.name,
      userRole: req.user!.role,
      actionType: 'staff_role_updated' as ActionType,
      description: `Updated role and permissions for ${updated!.name} to ${updated!.role.toUpperCase()}`,
      timestamp: 'Just now',
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update staff.' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    await UserModel.deleteOne({ _id: user._id });
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete staff.' });
  }
});

export default router;
