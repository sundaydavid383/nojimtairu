/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_FIRM_NAME?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_PAYPAL_DEMO?: string;
  readonly VITE_ENABLE_FORECASTING?: string;
  readonly VITE_DEFAULT_THEME?: string;
  readonly VITE_FIRM_EMAIL?: string;
  readonly VITE_FIRM_PHONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
