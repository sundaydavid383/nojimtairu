import mongoose, { Schema, Document } from 'mongoose';
import { UserRole, UserPermissions, UserRoles } from '../types';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  title: string;
  avatar: string;
  phone: string;
  lastActive: string;
  permissions: UserPermissions;
  createdAt: Date;
  updatedAt: Date;
}

const UserPermissionsSchema = new Schema<UserPermissions>(
  {
    canAddProperty: { type: Boolean, default: false },
    canEditProperty: { type: Boolean, default: false },
    canDeleteProperty: { type: Boolean, default: false },
    canRecordPayment: { type: Boolean, default: false },
    canManageStaff: { type: Boolean, default: false },
    canExportFinancials: { type: Boolean, default: false },
    canViewAuditLogs: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: UserRoles, default: 'staff' },
    title: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    lastActive: { type: String, default: 'Never logged in' },
    permissions: { type: UserPermissionsSchema, required: true },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

export const UserModel = mongoose.model<IUser>('User', UserSchema);
