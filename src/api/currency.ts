import axios from './axios';
import { Currency } from './types/currency';

const find = async (): Promise<Currency[]> => {
  const response = await axios.get('public/currency/all');
  return response.data;
};

export const currency = { find };
