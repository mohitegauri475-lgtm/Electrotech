export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
