export type UserRole = 'admin' | 'staff' | 'viewer';
export const UserRoles: UserRole[] = ['admin', 'staff', 'viewer'];

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';
export const PaymentStatuses: PaymentStatus[] = ['paid', 'partial', 'pending', 'overdue'];

export type PropertyType = 
  | 'Commercial'
  | 'Residential'
  | 'Industrial'
  | 'Agricultural'
  | 'Mixed Use'
  | 'Probate & Estate';
export const PropertyTypes: PropertyType[] = ['Commercial', 'Residential', 'Industrial', 'Agricultural', 'Mixed Use', 'Probate & Estate'];

export type PaymentMode = 
  | 'Bank Transfer'
  | 'Certified Cheque'
  | 'Escrow Account'
  | 'Direct Deposit'
  | 'USD Wire Transfer'
  | 'PayPal (Demo)';
export const PaymentModes: PaymentMode[] = ['Bank Transfer', 'Certified Cheque', 'Escrow Account', 'Direct Deposit', 'USD Wire Transfer', 'PayPal (Demo)'];

export type ConveyancingStatus = 
  | 'Drafting Contract'
  | 'Deed Executed'
  | 'Governor\'s Consent Pending'
  | 'Stamp Duty Cleared'
  | 'Registered & Perfected';
export const ConveyancingStatuses: ConveyancingStatus[] = ['Drafting Contract', 'Deed Executed', 'Governor\'s Consent Pending', 'Stamp Duty Cleared', 'Registered & Perfected'];

export type DocumentCategory = 'Receipt' | 'Title Deed' | 'Survey Plan' | 'Tax Clearance' | 'Power of Attorney';
export const DocumentCategories: DocumentCategory[] = ['Receipt', 'Title Deed', 'Survey Plan', 'Tax Clearance', 'Power of Attorney'];

export type ReceiptStatus = 'Verified & Stamped' | 'Pending Audit' | 'Reconciled';
export const ReceiptStatuses: ReceiptStatus[] = ['Verified & Stamped', 'Pending Audit', 'Reconciled'];

export type ActionType = 
  | 'payment_recorded'
  | 'property_created'
  | 'property_updated'
  | 'property_deleted'
  | 'status_changed'
  | 'receipt_verified'
  | 'staff_role_updated'
  | 'document_uploaded';
export const ActionTypes: ActionType[] = ['payment_recorded', 'property_created', 'property_updated', 'property_deleted', 'status_changed', 'receipt_verified', 'staff_role_updated', 'document_uploaded'];

export interface UserPermissions {
  canAddProperty: boolean;
  canEditProperty: boolean;
  canDeleteProperty: boolean;
  canRecordPayment: boolean;
  canManageStaff: boolean;
  canExportFinancials: boolean;
  canViewAuditLogs: boolean;
}

export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  title: string;
  avatar: string;
  phone: string;
  lastActive: string;
  permissions: UserPermissions;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentAttachment {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'doc';
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  previewUrl?: string;
  category: DocumentCategory;
}

export interface PaymentRecord {
  _id?: string;
  id: string;
  propertyId: string;
  receiptNumber: string;
  amount: number;
  date: string;
  paymentMode: PaymentMode;
  bankReference: string;
  issuingBank?: string;
  payerName: string;
  receivedBy: string;
  notes: string;
  receiptAttachmentUrl?: string;
  receiptThumbnailUrl?: string;
  receiptStatus: ReceiptStatus;
  balanceAfter: number;
  isPayPalDemo?: boolean;
  createdAt?: Date;
}

export interface Property {
  _id?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id?: string;
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
  createdAt?: Date;
}

export interface DashboardStats {
  totalProperties: number;
  fullyPaidCount: number;
  partialCount: number;
  pendingCount: number;
  overdueCount: number;
  totalValuation: number;
  totalCollected: number;
  totalPendingBalance: number;
  collectionRatePercentage: number;
}

export interface ForecastMonth {
  month: string;
  projectedRevenue: number;
  confirmedRevenue: number;
  potentialRiskAmount: number;
}

export interface ForecastMilestone {
  propertyId: string;
  propertyName: string;
  clientName: string;
  expectedAmount: number;
  expectedDate: string;
  confidenceScore: 'High (90%)' | 'Medium (70%)' | 'Moderate (50%)';
  triggerEvent: string;
}
