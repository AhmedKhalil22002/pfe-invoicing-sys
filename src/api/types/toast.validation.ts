import { ToastPosition, TypeOptions } from 'react-toastify';

export type ToastValidation = {
  message: string;
  type?: TypeOptions;
  position?: ToastPosition;
};
