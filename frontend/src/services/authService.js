import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data.data;
  },

  register: async (userData) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get(ENDPOINTS.AUTH.ME);
    return response.data.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put(ENDPOINTS.AUTH.PROFILE, profileData);
    return response.data.data;
  },
};
