import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const reviewService = {
  getAllReviews: async (hamperId) => {
    const params = hamperId ? { hamperId } : {};
    const response = await apiClient.get(ENDPOINTS.REVIEWS, { params });
    return response.data.data;
  },
};
