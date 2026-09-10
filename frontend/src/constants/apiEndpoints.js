/**
 * Normalizes the API Base URL:
 * - Falls back to '/api' for local development via Vite proxy
 * - Strips any trailing slashes
 * - Automatically appends '/api' if a full cloud host URL (e.g. https://electrotech-backend.onrender.com)
 *   is provided in VITE_API_BASE_URL without the '/api' path.
 */
const getNormalizedApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || !envUrl.trim()) {
    return '/api';
  }
  let cleanUrl = envUrl.trim();
  while (cleanUrl.endsWith('/')) {
    cleanUrl = cleanUrl.slice(0, -1);
  }
  if (cleanUrl.startsWith('http') && !cleanUrl.endsWith('/api')) {
    cleanUrl = `${cleanUrl}/api`;
  }
  return cleanUrl;
};

export const API_BASE_URL = getNormalizedApiBaseUrl();

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
  },
  BOXES: '/boxes',
  PRODUCTS: '/products',
  HAMPERS: '/hampers',
  CUSTOM_HAMPERS: '/custom-hampers',
  CART: '/cart',
  ORDERS: '/orders',
  REVIEWS: '/reviews',
};
