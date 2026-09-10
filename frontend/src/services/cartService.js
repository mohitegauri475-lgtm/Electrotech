import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get(ENDPOINTS.CART);
    return response.data.data;
  },

  addToCart: async (itemData) => {
    const response = await apiClient.post(ENDPOINTS.CART, itemData);
    return response.data.data;
  },

  updateQuantity: async (cartItemId, quantity) => {
    const response = await apiClient.put(`${ENDPOINTS.CART}/${cartItemId}`, null, {
      params: { quantity },
    });
    return response.data.data;
  },

  removeFromCart: async (cartItemId) => {
    const response = await apiClient.delete(`${ENDPOINTS.CART}/${cartItemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete(ENDPOINTS.CART);
    return response.data;
  },
};
