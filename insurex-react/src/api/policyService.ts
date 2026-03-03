import axios from 'axios';
import { Policy } from '../types/insurance';

const API_URL = process.env.VITE_API_BASE_URL;

export const getPolicies = async (): Promise<Policy[]> => {
  const response = await axios.get<Policy[]>(`${API_URL}/policies`);
  return response.data; // Data is now typed as Policy[]
};