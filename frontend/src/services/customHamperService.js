import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const customHamperService = {
  createCustomHamper: async (hamperData) => {
    const response = await apiClient.post(ENDPOINTS.CUSTOM_HAMPERS, hamperData);
    return response.data.data;
  },

  getCustomHamperById: async (id) => {
    const response = await apiClient.get(`${ENDPOINTS.CUSTOM_HAMPERS}/${id}`);
    return response.data.data;
  },

  getMyCustomHampers: async () => {
    const response = await apiClient.get(`${ENDPOINTS.CUSTOM_HAMPERS}/my`);
    return response.data.data;
  },
};
