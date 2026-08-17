/**
 * Application Configuration Service
 * 
 * Safely parses environment variables from Vite (import.meta.env)
 * with robust, type-safe fallback defaults so the application never breaks.
 */

export interface AppConfig {
  appName: string;
  firmName: string;
  apiBaseUrl: string;
  enablePaypalDemo: boolean;
  enableForecasting: boolean;
  defaultTheme: 'light' | 'dark';
  firmEmail: string;
  firmPhone: string;
  firmAddress: string;
  version: string;
  imagekit: {
    publicKey: string;
    urlEndpoint: string;
    authenticationEndpoint: string;
  };
}

const parseBoolean = (value: string | boolean | undefined, defaultValue: boolean): boolean => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'enabled';
};

export const config: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Nojim Tairu & Co. — Property & Payment Records',
  firmName: import.meta.env.VITE_FIRM_NAME || 'Nojim Tairu & Co. (Barristers & Solicitors)',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  enablePaypalDemo: parseBoolean(import.meta.env.VITE_ENABLE_PAYPAL_DEMO, true),
  enableForecasting: parseBoolean(import.meta.env.VITE_ENABLE_FORECASTING, false),
  defaultTheme: (import.meta.env.VITE_DEFAULT_THEME === 'dark' ? 'dark' : 'light'),
  firmEmail: import.meta.env.VITE_FIRM_EMAIL || 'info@ntlaw.ng',
  firmPhone: import.meta.env.VITE_FIRM_PHONE || '+234 803 555 0192',
  firmAddress: 'Chambers of Chief Nojim Tairu, SAN, 14th Floor, Western House, 8/10 Broad Street, Lagos Island, Nigeria',
  version: '2.4.0-chambers',
  imagekit: {
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'YOUR_IMAGEKIT_PUBLIC_KEY',
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/YOUR_IMAGEKIT_ID',
    authenticationEndpoint: import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT || '/api/imagekit/auth',
  },
};

if (config.imagekit.publicKey === 'YOUR_IMAGEKIT_PUBLIC_KEY') {
  console.warn('[Config] ImageKit public key is not set. Uploads will be disabled until VITE_IMAGEKIT_PUBLIC_KEY is provided.');
}

export default config;
