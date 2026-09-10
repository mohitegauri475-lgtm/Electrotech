import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const boxService = {
  getAllBoxes: async () => {
    const response = await apiClient.get(ENDPOINTS.BOXES);
    return response.data.data;
  },

  getBoxById: async (id) => {
    const response = await apiClient.get(`${ENDPOINTS.BOXES}/${id}`);
    return response.data.data;
  },
};
