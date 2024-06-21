import axios from "./axios";
import { Cabinet } from "./types/cabinet";

//defined so we can handle the main process
const TEST_CABINET = 15

const findOne = async (): Promise<Cabinet> => {
  const response = await axios.get(`public/cabinet/${TEST_CABINET}`);
  return response.data;
};

export const cabinet = { findOne };
