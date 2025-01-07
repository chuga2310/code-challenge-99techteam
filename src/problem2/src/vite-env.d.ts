/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOKEN_ICON_BASE_URL: string;
  readonly VITE_TOKEN_PRICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}