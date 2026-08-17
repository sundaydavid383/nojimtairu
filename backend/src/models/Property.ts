import mongoose, { Schema, Document } from 'mongoose';
import {
  PaymentMode,
  PaymentStatus,
  PropertyType,
  ConveyancingStatus,
  DocumentCategory,
  ReceiptStatus,
  PaymentModes,
  PaymentStatuses,
  PropertyTypes,
  ConveyancingStatuses,
  DocumentCategories,
  ReceiptStatuses,
  DocumentAttachment,
  PaymentRecord,
} from '../types';

export interface IProperty extends Document {
  id: string;
  fileNumber: string;
  titleRef: string;
  name: string;
  address: string;
  cityState: string;
  propertyType: PropertyType;
  coverImage: string;
  images: string[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  clientNIN_ID?: string;
  agreedPrice: number;
  legalFee: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  primaryPaymentMode: PaymentMode;
  lastPaymentDate?: string;
  nextDueDate?: string;
  conveyancingStatus: ConveyancingStatus;
  notes: string;
  documents: DocumentAttachment[];
  payments: PaymentRecord[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentAttachmentSchema = new Schema<DocumentAttachment>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, enum: ['pdf', 'image', 'doc'], required: true },
    fileSize: { type: String, required: true },
    uploadDate: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    previewUrl: { type: String },
    category: { type: String, enum: DocumentCategories, required: true },
  },
  { _id: false }
);

const PaymentRecordSchema = new Schema<PaymentRecord>(
  {
    id: { type: String, required: true },
    propertyId: { type: String, required: true, index: true },
    receiptNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
    paymentMode: { type: String, enum: PaymentModes, required: true },
    bankReference: { type: String, required: true },
    issuingBank: { type: String },
    payerName: { type: String, required: true },
    receivedBy: { type: String, required: true },
    notes: { type: String, default: '' },
    receiptAttachmentUrl: { type: String },
    receiptThumbnailUrl: { type: String },
    receiptStatus: { type: String, enum: ReceiptStatuses, default: 'Verified & Stamped' },
    balanceAfter: { type: Number, required: true },
    isPayPalDemo: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PropertySchema = new Schema<IProperty>(
  {
    id: { type: String, required: true, unique: true },
    fileNumber: { type: String, required: true, unique: true },
    titleRef: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    cityState: { type: String, required: true, trim: true },
    propertyType: { type: String, enum: PropertyTypes, required: true },
    coverImage: { type: String, default: '' },
    images: [{ type: String }],
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, lowercase: true, trim: true },
    clientPhone: { type: String, required: true, trim: true },
    clientAddress: { type: String, trim: true },
    clientNIN_ID: { type: String, trim: true },
    agreedPrice: { type: Number, required: true, min: 0 },
    legalFee: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    balanceAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: PaymentStatuses, default: 'pending' },
    primaryPaymentMode: { type: String, enum: PaymentModes, default: 'Bank Transfer' },
    lastPaymentDate: { type: String },
    nextDueDate: { type: String },
    conveyancingStatus: { type: String, enum: ConveyancingStatuses, default: 'Drafting Contract' },
    notes: { type: String, default: '' },
    documents: [DocumentAttachmentSchema],
    payments: [PaymentRecordSchema],
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

PropertySchema.index({ paymentStatus: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ createdAt: -1 });

export const PropertyModel = mongoose.model<IProperty>('Property', PropertySchema);
