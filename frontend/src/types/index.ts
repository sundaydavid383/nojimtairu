export type UserRole = 'admin' | 'staff' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  phone: string;
  lastActive: string;
  permissions: {
    canAddProperty: boolean;
    canEditProperty: boolean;
    canDeleteProperty: boolean;
    canRecordPayment: boolean;
    canManageStaff: boolean;
    canExportFinancials: boolean;
    canViewAuditLogs: boolean;
  };
}

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';

export type PropertyType = 
  | 'Commercial'
  | 'Residential'
  | 'Industrial'
  | 'Agricultural'
  | 'Mixed Use'
  | 'Probate & Estate';

export type PaymentMode = 
  | 'Bank Transfer'
  | 'Certified Cheque'
  | 'Escrow Account'
  | 'Direct Deposit'
  | 'USD Wire Transfer'
  | 'PayPal (Demo)';

export type ConveyancingStatus = 
  | 'Drafting Contract'
  | 'Deed Executed'
  | 'Governor\'s Consent Pending'
  | 'Stamp Duty Cleared'
  | 'Registered & Perfected';

export interface DocumentAttachment {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'doc';
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  previewUrl?: string;
  category: 'Receipt' | 'Title Deed' | 'Survey Plan' | 'Tax Clearance' | 'Power of Attorney';
}

export interface PaymentRecord {
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
  receiptStatus: 'Verified & Stamped' | 'Pending Audit' | 'Reconciled';
  balanceAfter: number;
  isPayPalDemo?: boolean;
}

export interface Property {
  id: string;
  fileNumber: string; // e.g. NTC-PROP-2024-001
  titleRef: string; // e.g. Certificate of Occupancy #LA-90218
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
  totalAmount: number; // agreedPrice + legalFee + disbursements
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
  id: string;
  propertyId?: string;
  propertyName?: string;
  fileNumber?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  actionType: 
    | 'payment_recorded'
    | 'property_created'
    | 'property_updated'
    | 'property_deleted'
    | 'status_changed'
    | 'receipt_verified'
    | 'staff_role_updated'
    | 'document_uploaded';
  description: string;
  timestamp: string;
  amount?: number;
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
