import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const hamperService = {
  getAllHampers: async (filters = {}) => {
    const response = await apiClient.get(ENDPOINTS.HAMPERS, { params: filters });
    return response.data.data;
  },

  getHamperById: async (id) => {
    const response = await apiClient.get(`${ENDPOINTS.HAMPERS}/${id}`);
    return response.data.data;
  },
};
