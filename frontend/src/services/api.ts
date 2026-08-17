import {
  Property,
  PaymentRecord,
  User,
  ActivityLog,
  DashboardStats,
  PaymentStatus,
  ForecastMonth,
  ForecastMilestone,
} from '../types';
import { config } from '../config';

const TOKEN_KEY = 'ntc_auth_token_v1';
const DEFAULT_TIMEOUT = 30000;

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

export class ApiError extends Error {
  status: number;
  isNetworkError: boolean;
  backendMessage?: string;

  constructor(
    message: string,
    status: number,
    isNetworkError = false,
    backendMessage?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
    this.backendMessage = backendMessage;
  }
}

export const HTTP_ERROR_MESSAGES: Record<number, { title: string; message: string }> = {
  400: {
    title: 'Invalid Request',
    message:
      'The request contains invalid data. Please check your input and try again.',
  },
  401: {
    title: 'Session Expired',
    message:
      'Your session has expired or is invalid. Please log in again.',
  },
  403: {
    title: 'Access Denied',
    message:
      'You do not have permission to perform this action.',
  },
  404: {
    title: 'Not Found',
    message:
      'The requested resource could not be found.',
  },
  409: {
    title: 'Conflict',
    message:
      'This action conflicts with existing data. Please refresh and try again.',
  },
  422: {
    title: 'Validation Error',
    message:
      'The submitted data failed validation. Please correct the highlighted fields.',
  },
  429: {
    title: 'Too Many Requests',
    message:
      'Too many requests. Please wait a moment and try again.',
  },
  500: {
    title: 'Server Error',
    message:
      'A server error occurred. Please try again later or contact support.',
  },
  502: {
    title: 'Bad Gateway',
    message:
      'The server is temporarily unavailable. Please try again later.',
  },
  503: {
    title: 'Service Unavailable',
    message:
      'The service is temporarily unavailable. Please try again later.',
  },
};

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return 'Unable to reach the server. Please check your connection and try again.';
    }
    if (HTTP_ERROR_MESSAGES[error.status]) {
      return HTTP_ERROR_MESSAGES[error.status].message;
    }
    if (error.status >= 500) {
      return HTTP_ERROR_MESSAGES[500].message;
    }
    return (
      error.backendMessage ||
      error.message ||
      'Unable to complete this request. Please try again.'
    );
  }
  if (error instanceof Error) {
    return error.message || 'Unable to complete this request. Please try again.';
  }
  return 'Unable to complete this request. Please try again.';
}

export function getApiErrorTitle(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetworkError) return 'Network Error';
    if (HTTP_ERROR_MESSAGES[error.status]) {
      return HTTP_ERROR_MESSAGES[error.status].title;
    }
    if (error.status >= 500) return 'Server Error';
    return 'Request Failed';
  }
  if (error instanceof Error) {
    return 'Request Failed';
  }
  return 'Request Failed';
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 2
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }

      const response = await fetch(`${config.apiBaseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let backendMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          backendMessage = errorData.message || backendMessage;
        } catch {
          // keep default message
        }
        const apiError = new ApiError(
          backendMessage,
          response.status,
          false,
          backendMessage
        );

        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          if (unauthorizedHandler) {
            unauthorizedHandler();
          }
        }

        if (response.status >= 500 && attempt < retries) {
          lastError = apiError;
          continue;
        }
        throw apiError;
      }

      const result = await response.json();
      if (!result.success) {
        throw new ApiError(
          result.message || 'API request failed',
          0,
          false,
          result.message
        );
      }
      return result.data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        if (
          (error.isNetworkError || error.status >= 500) &&
          attempt < retries
        ) {
          lastError = error;
          continue;
        }
        throw error;
      }

      if (error.name === 'AbortError') {
        const timeoutError = new ApiError(
          'Request timed out',
          0,
          true
        );
        if (attempt < retries) {
          lastError = timeoutError;
          continue;
        }
        throw timeoutError;
      }

      const isNetworkError =
        error.message === 'Failed to fetch' ||
        error.message === 'NetworkError when attempting to fetch resource.';

      const networkError = new ApiError(
        isNetworkError ? 'Network error' : error.message || 'Unknown error',
        0,
        true
      );

      if (attempt < retries) {
        lastError = networkError;
        continue;
      }
      throw networkError;
    }
  }

  throw lastError!;
}

/**
 * Nojim Tairu & Co. API Service Layer
 * Calls the real backend API
 */
export const propertyApi = {
  async getProperties(): Promise<Property[]> {
    try {
      const params = new URLSearchParams();
      return await request<Property[]>('/properties?' + params.toString());
    } catch (error: any) {
      console.error('Failed to fetch properties:', error.message);
      throw error;
    }
  },

  async getPropertyById(id: string): Promise<Property | null> {
    try {
      const result = await request<Property>(`/properties/${id}`);
      return result;
    } catch (error: any) {
      console.error(`Failed to fetch property ${id}:`, error.message);
      throw error;
    }
  },

  async createProperty(
    propertyData: any,
    currentUser: User
  ): Promise<Property> {
    return request<Property>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  },

  async updateProperty(
    id: string,
    updates: Partial<Property>,
    currentUser: User
  ): Promise<Property> {
    return request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteProperty(id: string, currentUser: User): Promise<boolean> {
    await request(`/properties/${id}`, {
      method: 'DELETE',
    });
    return true;
  },

  async recordPayment(
    propertyId: string,
    paymentInput: any,
    currentUser: User
  ): Promise<{ property: Property; payment: PaymentRecord }> {
    return request<{ property: Property; payment: PaymentRecord }>(
      `/payments/${propertyId}`,
      {
        method: 'POST',
        body: JSON.stringify(paymentInput),
      }
    );
  },

  async resetDemoData(): Promise<void> {
    // No-op on backend; seeding is done via CLI
  },
};

export const activityApi = {
  async getActivities(): Promise<ActivityLog[]> {
    return request<ActivityLog[]>('/activities');
  },

  async logActivity(
    log: Omit<ActivityLog, 'id' | 'timestamp'>
  ): Promise<ActivityLog> {
    return request<ActivityLog>('/activities', {
      method: 'POST',
      body: JSON.stringify(log),
    });
  },
};

export const staffApi = {
  async getStaff(): Promise<User[]> {
    return request<User[]>('/staff');
  },

  async updateStaff(
    id: string,
    updates: Partial<User>,
    currentUser: User
  ): Promise<User> {
    return request<User>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async addStaff(
    staffData: Omit<User, 'id' | 'lastActive'>,
    currentUser: User
  ): Promise<User> {
    return request<User>('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  },
};

/**
 * ImageKit Integration
 * Get a signed upload token from the backend.
 * The backend uses the ImageKit private key to sign the token.
 */
export const imageKitApi = {
  async getUploadAuthToken(): Promise<{
    token: string;
    expire: number;
    signature: string;
  }> {
    if (config.imagekit.publicKey === 'YOUR_IMAGEKIT_PUBLIC_KEY') {
      throw new Error(
        'ImageKit is not configured. Set VITE_IMAGEKIT_PUBLIC_KEY in .env'
      );
    }
    return request<{ token: string; expire: number; signature: string }>(
      '/imagekit/auth',
      {
        method: 'POST',
      }
    );
  },
};

/**
 * Email Integration (via backend Brevo proxy)
 * Sends transactional emails through the backend to avoid exposing the Brevo API key.
 */
export const emailApi = {
  async sendPaymentReceipt(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ) {
    return request<{ success: boolean; message: string; skipped?: boolean }>(
      '/email/send',
      {
        method: 'POST',
        body: JSON.stringify({ to, subject, htmlContent, textContent }),
      }
    );
  },
};

export function computeDashboardStats(properties: Property[]): DashboardStats {
  const totalProperties = properties.length;
  let fullyPaidCount = 0;
  let partialCount = 0;
  let pendingCount = 0;
  let overdueCount = 0;
  let totalValuation = 0;
  let totalCollected = 0;
  let totalPendingBalance = 0;

  for (const p of properties) {
    totalValuation += p.totalAmount;
    totalCollected += p.paidAmount;
    totalPendingBalance += p.balanceAmount;

    if (p.paymentStatus === 'paid') fullyPaidCount++;
    else if (p.paymentStatus === 'partial') partialCount++;
    else if (p.paymentStatus === 'pending') pendingCount++;
    else if (p.paymentStatus === 'overdue') overdueCount++;
  }

  const collectionRatePercentage =
    totalValuation > 0 ? (totalCollected / totalValuation) * 100 : 0;

  return {
    totalProperties,
    fullyPaidCount,
    partialCount,
    pendingCount,
    overdueCount,
    totalValuation,
    totalCollected,
    totalPendingBalance,
    collectionRatePercentage,
  };
}

export function generateForecastingData(properties: Property[]): {
  monthlyProjections: ForecastMonth[];
  upcomingMilestones: ForecastMilestone[];
  totalProjectedInflow: number;
  highConfidenceTotal: number;
  averageCollectionCycleDays: number;
} {
  let totalProjectedInflow = 0;
  let highConfidenceTotal = 0;
  const milestones: ForecastMilestone[] = [];

  properties.forEach((p) => {
    if (p.balanceAmount > 0) {
      totalProjectedInflow += p.balanceAmount;
      const isHigh =
        p.conveyancingStatus === "Governor's Consent Pending" ||
        p.conveyancingStatus === 'Deed Executed';
      if (isHigh) highConfidenceTotal += p.balanceAmount;

      milestones.push({
        propertyId: p.id,
        propertyName: p.name,
        clientName: p.clientName,
        expectedAmount: p.balanceAmount,
        expectedDate: p.nextDueDate || '2024-09-30',
        confidenceScore: isHigh
          ? 'High (90%)'
          : p.paidAmount > 0
          ? 'Medium (70%)'
          : 'Moderate (50%)',
        triggerEvent:
          p.conveyancingStatus === "Governor's Consent Pending"
            ? 'Upon receipt of Alausa Governor\'s Consent seal'
            : p.conveyancingStatus === 'Deed Executed'
            ? 'Upon counterpart deed exchange & stamp clearance'
            : 'Upon perfection of title documentation',
      });
    }
  });

  const monthlyProjections: ForecastMonth[] = [
    { month: 'Aug 2024', projectedRevenue: 84750000, confirmedRevenue: 120000000, potentialRiskAmount: 0 },
    { month: 'Sep 2024', projectedRevenue: 342500000, confirmedRevenue: 550000000, potentialRiskAmount: 25000000 },
    { month: 'Oct 2024', projectedRevenue: 399000000, confirmedRevenue: 0, potentialRiskAmount: 50000000 },
    { month: 'Nov 2024', projectedRevenue: 244000000, confirmedRevenue: 50000000, potentialRiskAmount: 15000000 },
    { month: 'Dec 2024', projectedRevenue: 115500000, confirmedRevenue: 0, potentialRiskAmount: 10000000 },
    { month: 'Jan 2025', projectedRevenue: 180000000, confirmedRevenue: 0, potentialRiskAmount: 20000000 },
  ];

  return {
    monthlyProjections,
    upcomingMilestones: milestones,
    totalProjectedInflow,
    highConfidenceTotal,
    averageCollectionCycleDays: 38,
  };
}

export function formatNaira(amount: number, compact: boolean = false): string {
  if (compact) {
    if (amount >= 1_000_000_000) {
      return `₦${(amount / 1_000_000_000).toFixed(2)}B`;
    }
    if (amount >= 1_000_000) {
      return `₦${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
      return `₦${(amount / 1_000).toFixed(0)}k`;
    }
  }
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
