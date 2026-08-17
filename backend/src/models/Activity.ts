import mongoose, { Schema, Document } from 'mongoose';
import { ActionType, UserRole, ActionTypes, UserRoles } from '../types';

export interface IActivityLog extends Document {
  id: string;
  propertyId?: string;
  propertyName?: string;
  fileNumber?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  actionType: ActionType;
  description: string;
  timestamp: string;
  amount?: number;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    id: { type: String, required: true, unique: true },
    propertyId: { type: String, index: true },
    propertyName: { type: String },
    fileNumber: { type: String },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, enum: UserRoles, required: true },
    actionType: { type: String, enum: ActionTypes, required: true },
    description: { type: String, required: true },
    timestamp: { type: String, required: true },
    amount: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });

export const ActivityLogModel = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
