import axios from "./axios";
import { Firm } from "./types/firm";

const find = async (): Promise<Firm[]> => {
  const response = await axios.get('public/firm/all');
  return response.data;
};

export const firm = { find };
