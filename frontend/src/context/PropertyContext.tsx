import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Property, 
  PaymentRecord, 
  User, 
  ActivityLog, 
  DashboardStats,
  PaymentStatus,
  PropertyType 
} from '../types';
import { propertyApi, activityApi, staffApi, computeDashboardStats } from '../services/api';
import { config } from '../config';
import { useAuth } from './AuthContext';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  stats: DashboardStats;
  activities: ActivityLog[];
  staffMembers: User[];
  isLoading: boolean;
  error: string | null;
  
  // Theming
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Feature Flags
  enableForecasting: boolean;
  setEnableForecasting: (val: boolean) => void;
  toggleForecasting: () => void;

  // Navigation & Selection
  currentView: 'dashboard' | 'properties' | 'detail' | 'staff' | 'guide' | 'forecasting';
  setCurrentView: (view: 'dashboard' | 'properties' | 'detail' | 'staff' | 'guide' | 'forecasting') => void;
  selectedPropertyId: string | null;
  selectedProperty: Property | null;
  selectProperty: (id: string | null) => void;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: PaymentStatus | 'all';
  setStatusFilter: (status: PaymentStatus | 'all') => void;
  typeFilter: PropertyType | 'all';
  setTypeFilter: (type: PropertyType | 'all') => void;
  sortBy: 'latest' | 'oldest' | 'amount_high' | 'amount_low' | 'name';
  setSortBy: (sort: 'latest' | 'oldest' | 'amount_high' | 'amount_low' | 'name') => void;
  viewMode: 'table' | 'grid';
  setViewMode: (mode: 'table' | 'grid') => void;

  // Modals
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingProperty: Property | null;
  setEditingProperty: (prop: Property | null) => void;
  
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  paymentTargetProperty: Property | null;
  openPaymentModal: (property: Property) => void;

  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
  activeReceipt: { payment: PaymentRecord; property: Property } | null;
  viewReceipt: (payment: PaymentRecord, property: Property) => void;

  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;

  // Contextual Game-Style Section Guide
  activeSectionGuide: string | null;
  openSectionGuide: (section?: string) => void;
  closeSectionGuide: () => void;
  markSectionGuideSeen: (section: string, seen: boolean) => void;

  isLeadershipPitchOpen: boolean;
  setIsLeadershipPitchOpen: (open: boolean) => void;

  isProjectGuidelineOpen: boolean;
  setIsProjectGuidelineOpen: (open: boolean) => void;

  // Actions
  refreshData: () => Promise<void>;
  createProperty: (data: any) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<boolean>;
  recordPayment: (propertyId: string, paymentData: any) => Promise<void>;
  updateStaffMember: (id: string, updates: Partial<User>) => Promise<void>;
  resetDemoData: () => Promise<void>;
  retryLoad: () => Promise<void>;

  // Toasts
  toasts: ToastNotification[];
  addToast: (type: ToastNotification['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Theme state (defaults to light as requested)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('ntc_theme_v2');
    return saved === 'dark' ? 'dark' : (config.defaultTheme || 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ntc_theme_v2', theme);
  }, [theme]);

  const setTheme = (t: 'light' | 'dark') => setThemeState(t);
  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Feature Flag: Forecasting (default from config/env)
  const [enableForecasting, setEnableForecastingState] = useState<boolean>(() => {
    const saved = localStorage.getItem('ntc_enable_forecasting');
    if (saved !== null) return saved === 'true';
    return config.enableForecasting;
  });

  const setEnableForecasting = (val: boolean) => {
    setEnableForecastingState(val);
    localStorage.setItem('ntc_enable_forecasting', String(val));
  };

  const toggleForecasting = () => {
    setEnableForecasting(!enableForecasting);
  };

  const [properties, setProperties] = useState<Property[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // View routing
  const [currentView, setCurrentView] = useState<'dashboard' | 'properties' | 'detail' | 'staff' | 'guide' | 'forecasting'>('dashboard');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'amount_high' | 'amount_low' | 'name'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentTargetProperty, setPaymentTargetProperty] = useState<Property | null>(null);
  
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<{ payment: PaymentRecord; property: Property } | null>(null);
  
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [activeSectionGuide, setActiveSectionGuide] = useState<string | null>(null);
  const [isLeadershipPitchOpen, setIsLeadershipPitchOpen] = useState<boolean>(false);
  const [isProjectGuidelineOpen, setIsProjectGuidelineOpen] = useState<boolean>(false);

  const openSectionGuide = useCallback((section?: string) => {
    const targetSection = section || currentView;
    setActiveSectionGuide(targetSection);
  }, [currentView]);

  const closeSectionGuide = useCallback(() => {
    setActiveSectionGuide(null);
  }, []);

  const markSectionGuideSeen = useCallback((section: string, seen: boolean) => {
    if (seen) {
      localStorage.setItem(`ntc_seen_guide_${section}`, 'true');
    } else {
      localStorage.removeItem(`ntc_seen_guide_${section}`);
    }
  }, []);

  // Contextual Auto-Show on first visit to a page/section
  useEffect(() => {
    if (!currentView || currentView === 'guide') return;
    const key = `ntc_seen_guide_${currentView}`;
    const hasSeen = localStorage.getItem(key) === 'true';
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setActiveSectionGuide(currentView);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((type: ToastNotification['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data
  const refreshData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const [props, acts, staff] = await Promise.all([
        propertyApi.getProperties(),
        activityApi.getActivities(),
        staffApi.getStaff(),
      ]);
      setProperties(props);
      setActivities(acts);
      setStaffMembers(staff);
    } catch (err: any) {
      console.error('Failed to load initial property data:', err);
      const message = err.message || 'Could not retrieve records from server.';
      setError(message);
      addToast('error', 'Data Load Error', message);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const retryLoad = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Selected property object
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || null;

  const selectProperty = useCallback((id: string | null) => {
    setSelectedPropertyId(id);
    if (id) {
      setCurrentView('detail');
    }
  }, []);

  // Computed stats
  const stats = computeDashboardStats(properties);

  // Filtered and Sorted properties
  const filteredProperties = properties.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchFile = item.fileNumber.toLowerCase().includes(q);
      const matchClient = item.clientName.toLowerCase().includes(q);
      const matchAddress = item.address.toLowerCase().includes(q);
      const matchCity = item.cityState.toLowerCase().includes(q);
      const matchTitle = item.titleRef.toLowerCase().includes(q);
      if (!matchName && !matchFile && !matchClient && !matchAddress && !matchCity && !matchTitle) {
        return false;
      }
    }

    if (statusFilter !== 'all' && item.paymentStatus !== statusFilter) {
      return false;
    }

    if (typeFilter !== 'all' && item.propertyType !== typeFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'amount_high') {
      return b.totalAmount - a.totalAmount;
    }
    if (sortBy === 'amount_low') {
      return a.totalAmount - b.totalAmount;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Action methods
  const createProperty = async (data: any): Promise<Property> => {
    try {
      const created = await propertyApi.createProperty(data, currentUser);
      await refreshData();
      addToast('success', 'File Opened', `Successfully created ${created.fileNumber} for ${created.clientName}`);
      return created;
    } catch (err: any) {
      addToast('error', 'Creation Error', err.message || 'Failed to create property file');
      throw err;
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
    try {
      const updated = await propertyApi.updateProperty(id, updates, currentUser);
      await refreshData();
      addToast('success', 'Record Updated', `Successfully updated records for ${updated.fileNumber}`);
      return updated;
    } catch (err: any) {
      addToast('error', 'Update Error', err.message || 'Failed to update property record');
      throw err;
    }
  };

  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      const success = await propertyApi.deleteProperty(id, currentUser);
      if (selectedPropertyId === id) {
        setSelectedPropertyId(null);
        setCurrentView('properties');
      }
      await refreshData();
      addToast('info', 'Record Archived', 'Property file has been permanently removed from active ledger.');
      return success;
    } catch (err: any) {
      addToast('error', 'Deletion Error', err.message || 'Failed to delete property file');
      throw err;
    }
  };

  const recordPayment = async (propertyId: string, paymentData: any): Promise<void> => {
    try {
      const { property, payment } = await propertyApi.recordPayment(propertyId, paymentData, currentUser);
      await refreshData();
      addToast('success', 'Payment Logged', `Payment of ₦${payment.amount.toLocaleString()} registered (Receipt: ${payment.receiptNumber})`);
      
      // Auto open receipt for quick preview/print
      viewReceipt(payment, property);
    } catch (err: any) {
      addToast('error', 'Payment Error', err.message || 'Failed to record payment');
      throw err;
    }
  };

  const updateStaffMember = async (id: string, updates: Partial<User>): Promise<void> => {
    try {
      const updated = await staffApi.updateStaff(id, updates, currentUser);
      await refreshData();
      addToast('success', 'Staff Permissions Updated', `Permissions updated for ${updated.name}`);
    } catch (err: any) {
      addToast('error', 'Staff Update Error', err.message || 'Failed to update staff member');
      throw err;
    }
  };

  const resetDemoData = async (): Promise<void> => {
    await propertyApi.resetDemoData();
    await refreshData();
    addToast('info', 'Demo Reset', 'Default property portfolio and audit data restored.');
  };

  const openPaymentModal = (property: Property) => {
    setPaymentTargetProperty(property);
    setIsPaymentModalOpen(true);
  };

  const viewReceipt = (payment: PaymentRecord, property: Property) => {
    setActiveReceipt({ payment, property });
    setIsReceiptModalOpen(true);
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        stats,
        activities,
        staffMembers,
        isLoading,
        error,
        theme,
        setTheme,
        toggleTheme,
        enableForecasting,
        setEnableForecasting,
        toggleForecasting,
        currentView,
        setCurrentView,
        selectedPropertyId,
        selectedProperty,
        selectProperty,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        isAddModalOpen,
        setIsAddModalOpen,
        editingProperty,
        setEditingProperty,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentTargetProperty,
        openPaymentModal,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        activeReceipt,
        viewReceipt,
        isGuideOpen,
        setIsGuideOpen,
        activeSectionGuide,
        openSectionGuide,
        closeSectionGuide,
        markSectionGuideSeen,
        isLeadershipPitchOpen,
        setIsLeadershipPitchOpen,
        isProjectGuidelineOpen,
        setIsProjectGuidelineOpen,
        refreshData,
        createProperty,
        updateProperty,
        deleteProperty,
        recordPayment,
        updateStaffMember,
        resetDemoData,
        retryLoad,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = (): PropertyContextType => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};
