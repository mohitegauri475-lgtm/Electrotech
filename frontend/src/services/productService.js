import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const productService = {
  getAllProducts: async (category, occasion) => {
    const params = {};
    if (category && category.toLowerCase() !== 'all') {
      params.category = category;
    }
    if (occasion && occasion.toLowerCase() !== 'all') {
      params.occasion = occasion;
    }
    const response = await apiClient.get(ENDPOINTS.PRODUCTS, { params });
    return response.data.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`${ENDPOINTS.PRODUCTS}/${id}`);
    return response.data.data;
  },
};
