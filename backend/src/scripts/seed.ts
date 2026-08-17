import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PropertyModel } from '../models/Property';
import { UserModel } from '../models/User';
import { ActivityLogModel } from '../models/Activity';
import { Property, User, UserRole, ActionType, ActivityLog } from '../types';
import { config } from '../config';

dotenv.config();

const DEFAULT_PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
];

const DEFAULT_USERS: Omit<User, 'password'>[] = [
  {
    id: 'user-01',
    name: 'Chief Nojim Tairu, SAN',
    email: 'nojim.tairu@ntlaw.ng',
    role: 'admin',
    title: 'Senior Advocate & Managing Partner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phone: '+234 803 555 0192',
    lastActive: 'Just now',
    permissions: {
      canAddProperty: true,
      canEditProperty: true,
      canDeleteProperty: true,
      canRecordPayment: true,
      canManageStaff: true,
      canExportFinancials: true,
      canViewAuditLogs: true,
    },
  },
  {
    id: 'user-02',
    name: 'Barr. Folashade Adeleke',
    email: 'folashade.a@ntlaw.ng',
    role: 'staff',
    title: 'Senior Legal Associate (Property & Conveyancing)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phone: '+234 802 331 4489',
    lastActive: '12 mins ago',
    permissions: {
      canAddProperty: true,
      canEditProperty: true,
      canDeleteProperty: false,
      canRecordPayment: true,
      canManageStaff: false,
      canExportFinancials: true,
      canViewAuditLogs: true,
    },
  },
  {
    id: 'user-03',
    name: 'Michael O. Balogun',
    email: 'm.balogun@ntlaw.ng',
    role: 'staff',
    title: 'Conveyancing & Records Officer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phone: '+234 814 990 2311',
    lastActive: '45 mins ago',
    permissions: {
      canAddProperty: true,
      canEditProperty: true,
      canDeleteProperty: false,
      canRecordPayment: true,
      canManageStaff: false,
      canExportFinancials: false,
      canViewAuditLogs: false,
    },
  },
  {
    id: 'user-04',
    name: 'Alhaji Audu Ibrahim',
    email: 'audu.ibrahim@veritas-audit.ng',
    role: 'viewer',
    title: 'Retained External Auditor / Observer Partner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    phone: '+234 809 112 8843',
    lastActive: '2 hours ago',
    permissions: {
      canAddProperty: false,
      canEditProperty: false,
      canDeleteProperty: false,
      canRecordPayment: false,
      canManageStaff: false,
      canExportFinancials: false,
      canViewAuditLogs: true,
    },
  },
];

const INITIAL_PROPERTIES: Omit<Property, '_id'>[] = [
  {
    id: 'prop-001',
    fileNumber: 'NTC/PROP/2024/001',
    titleRef: 'Cert. of Occupancy No. 24/24/2018 (Lagos State Lands Bureau)',
    name: 'Victoria Island Waterfront Commercial Tower (14th Floor Suites)',
    address: 'Plot 1284, Bishop Oluwole Street, Victoria Island',
    cityState: 'Lagos Island, Lagos State',
    propertyType: 'Commercial',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    ],
    clientName: 'Apex Zenith Capital Partners Ltd',
    clientEmail: 'counsel@apexzenith.com',
    clientPhone: '+234 803 400 9182',
    clientAddress: '15 Ozumba Mbadiwe Way, Victoria Island, Lagos',
    agreedPrice: 850000000,
    legalFee: 42500000,
    totalAmount: 892500000,
    paidAmount: 550000000,
    balanceAmount: 342500000,
    paymentStatus: 'partial',
    primaryPaymentMode: 'Bank Transfer',
    lastPaymentDate: '2024-06-15',
    conveyancingStatus: 'Governor\'s Consent Pending',
    notes: 'Commercial suite acquisition for Apex Zenith Capital Partners. 14th floor fully fitted office space.',
    documents: [],
    payments: [],
    createdBy: 'Chief Nojim Tairu, SAN',
    createdAt: '2024-01-15',
    updatedAt: '2024-06-15',
  },
  {
    id: 'prop-002',
    fileNumber: 'NTC/PROP/2024/002',
    titleRef: 'Deed of Assignment No. LA-90218',
    name: 'Ikoyi Diplomatic Enclave Residence',
    address: '21A Idejo Street, Ikoyi',
    cityState: 'Lagos Island, Lagos State',
    propertyType: 'Residential',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    ],
    clientName: 'Mrs. Amaka Okafor',
    clientEmail: 'amaka.okafor@gmail.com',
    clientPhone: '+234 805 221 4433',
    clientAddress: '24 Akin Adesola Street, Victoria Island, Lagos',
    agreedPrice: 420000000,
    legalFee: 21000000,
    totalAmount: 441000000,
    paidAmount: 441000000,
    balanceAmount: 0,
    paymentStatus: 'paid',
    primaryPaymentMode: 'Bank Transfer',
    lastPaymentDate: '2024-03-20',
    conveyancingStatus: 'Registered & Perfected',
    notes: 'Fully paid residential property in Ikoyi. Title perfected and registered.',
    documents: [],
    payments: [],
    createdBy: 'Barr. Folashade Adeleke',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-20',
  },
  {
    id: 'prop-003',
    fileNumber: 'NTC/PROP/2024/003',
    titleRef: 'Right of Occupancy No. ABJ-44521',
    name: 'Asokoro Plot 12 Residential Development',
    address: 'Plot 12, Musa Yar\'Adua Crescent, Asokoro',
    cityState: 'Abuja, FCT',
    propertyType: 'Residential',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
    ],
    clientName: 'Dr. Ibrahim Musa',
    clientEmail: 'ibrahim.musa@yahoo.com',
    clientPhone: '+234 803 772 1199',
    clientAddress: 'Plot 12, Musa Yar\'Adua Crescent, Asokoro, Abuja',
    agreedPrice: 280000000,
    legalFee: 14000000,
    totalAmount: 294000000,
    paidAmount: 84000000,
    balanceAmount: 210000000,
    paymentStatus: 'partial',
    primaryPaymentMode: 'Bank Transfer',
    lastPaymentDate: '2024-05-10',
    nextDueDate: '2024-09-10',
    conveyancingStatus: 'Deed Executed',
    notes: 'Residential development in Asokoro. Installment plan active.',
    documents: [],
    payments: [],
    createdBy: 'Michael O. Balogun',
    createdAt: '2024-02-01',
    updatedAt: '2024-05-10',
  },
  {
    id: 'prop-004',
    fileNumber: 'NTC/PROP/2024/004',
    titleRef: 'Cert. of Occupancy No. LAG-77234',
    name: 'Lekki Phase 1 Mixed-Use Development',
    address: 'Block 5, Lekki Phase 1, Lagos',
    cityState: 'Lekki, Lagos State',
    propertyType: 'Mixed Use',
    coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80',
    ],
    clientName: 'Zenith Heights Ltd',
    clientEmail: 'info@zenithheights.ng',
    clientPhone: '+234 901 334 5566',
    clientAddress: '15 Admiralty Road, Lekki Phase 1, Lagos',
    agreedPrice: 650000000,
    legalFee: 32500000,
    totalAmount: 682500000,
    paidAmount: 0,
    balanceAmount: 682500000,
    paymentStatus: 'pending',
    primaryPaymentMode: 'Bank Transfer',
    conveyancingStatus: 'Drafting Contract',
    notes: 'Mixed-use development in Lekki Phase 1. Awaiting initial deposit.',
    documents: [],
    payments: [],
    createdBy: 'Chief Nojim Tairu, SAN',
    createdAt: '2024-06-01',
    updatedAt: '2024-06-01',
  },
];

const INITIAL_ACTIVITIES: Omit<ActivityLog, '_id'>[] = [
  {
    id: 'act-001',
    propertyId: 'prop-001',
    propertyName: 'Victoria Island Waterfront Commercial Tower',
    fileNumber: 'NTC/PROP/2024/001',
    userId: 'user-02',
    userName: 'Barr. Folashade Adeleke',
    userRole: 'staff',
    actionType: 'payment_recorded',
    description: 'Recorded payment of ₦550,000,000 via Bank Transfer for NTC/PROP/2024/001 (Receipt: NTC/REC/2024/4821). Status: PARTIAL',
    timestamp: '2 days ago',
    amount: 550000000,
  },
  {
    id: 'act-002',
    propertyId: 'prop-002',
    propertyName: 'Ikoyi Diplomatic Enclave Residence',
    fileNumber: 'NTC/PROP/2024/002',
    userId: 'user-01',
    userName: 'Chief Nojim Tairu, SAN',
    userRole: 'admin',
    actionType: 'property_updated',
    description: 'Updated payment status for NTC/PROP/2024/002 to PAID',
    timestamp: '3 days ago',
  },
  {
    id: 'act-003',
    propertyId: 'prop-003',
    propertyName: 'Asokoro Plot 12 Residential Development',
    fileNumber: 'NTC/PROP/2024/003',
    userId: 'user-03',
    userName: 'Michael O. Balogun',
    userRole: 'staff',
    actionType: 'property_created',
    description: 'Opened file NTC/PROP/2024/003 for Dr. Ibrahim Musa (Valuation: ₦294,000,000)',
    timestamp: '5 days ago',
  },
  {
    id: 'act-004',
    propertyId: 'prop-004',
    propertyName: 'Lekki Phase 1 Mixed-Use Development',
    fileNumber: 'NTC/PROP/2024/004',
    userId: 'user-02',
    userName: 'Barr. Folashade Adeleke',
    userRole: 'staff',
    actionType: 'property_created',
    description: 'Opened file NTC/PROP/2024/004 for Zenith Heights Ltd (Valuation: ₦682,500,000)',
    timestamp: '1 week ago',
  },
  {
    id: 'act-005',
    propertyId: 'prop-001',
    propertyName: 'Victoria Island Waterfront Commercial Tower',
    fileNumber: 'NTC/PROP/2024/001',
    userId: 'user-01',
    userName: 'Chief Nojim Tairu, SAN',
    userRole: 'admin',
    actionType: 'staff_role_updated',
    description: 'Updated role and permissions for Michael O. Balogun to STAFF',
    timestamp: '2 weeks ago',
  },
];

async function seed() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    await UserModel.deleteMany({});
    await PropertyModel.deleteMany({});
    await ActivityLogModel.deleteMany({});

    for (const user of DEFAULT_USERS) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 12);
      await UserModel.create({ ...user, password: hashedPassword });
    }
    console.log('Users seeded');

    for (const property of INITIAL_PROPERTIES) {
      await PropertyModel.create(property);
    }
    console.log('Properties seeded');

    for (const activity of INITIAL_ACTIVITIES) {
      await ActivityLogModel.create(activity);
    }
    console.log('Activities seeded');

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
