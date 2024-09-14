import axios from './axios';
import { Upload } from './types';

export interface UploadFileDto {
  file: File;
}

const findAll = async (): Promise<Upload[]> => {
  const response = await axios.get(`storage/all`);
  return response.data;
};

const findOne = async (id: number): Promise<Upload> => {
  const response = await axios.get(`storage/${id}`);
  return response.data;
};

const uploadFile = async (file: File): Promise<Upload> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post('storage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const downloadFile = async (slug: string): Promise<void> => {
  const response = await axios.get(`storage/file/${slug}`, {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', slug);
  document.body.appendChild(link);
  link.click();
};

export const upload = { findAll, findOne, uploadFile, downloadFile };
