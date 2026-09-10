import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await apiClient.post(ENDPOINTS.ORDERS, orderData);
    return response.data.data;
  },

  getUserOrders: async () => {
    const response = await apiClient.get(ENDPOINTS.ORDERS);
    return response.data.data;
  },

  getOrderByNumber: async (orderNumber) => {
    const response = await apiClient.get(`${ENDPOINTS.ORDERS}/${orderNumber}`);
    return response.data.data;
  },
};
