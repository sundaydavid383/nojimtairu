import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { config } from '../config';
import { User, UserRole, UserPermissions } from '../types';
import { AuthRequest, authenticate } from '../middleware/auth';

const router = Router();

router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    await UserModel.findByIdAndUpdate(user._id, { lastActive: 'Just now' });

    const token = jwt.sign(
      { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );

    const { password: _, ...safeUser } = user.toObject() as any;
    res.json({ success: true, token, user: safeUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
});

router.post('/register', async (req, res: Response) => {
  try {
    const { name, email, password, role, title } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: (role as UserRole) || 'staff',
      title: title || 'Legal Associate',
      avatar: '',
      phone: '',
      lastActive: 'Never logged in',
      permissions: {
        canAddProperty: (role as UserRole) === 'admin' || (role as UserRole) === 'staff',
        canEditProperty: (role as UserRole) === 'admin' || (role as UserRole) === 'staff',
        canDeleteProperty: (role as UserRole) === 'admin',
        canRecordPayment: (role as UserRole) === 'admin' || (role as UserRole) === 'staff',
        canManageStaff: (role as UserRole) === 'admin',
        canExportFinancials: (role as UserRole) === 'admin',
        canViewAuditLogs: true,
      },
    });

    await newUser.save();
    const { password: _, ...safeUser } = newUser.toObject() as any;
    res.status(201).json({ success: true, user: safeUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch user.' });
  }
});

export default router;
