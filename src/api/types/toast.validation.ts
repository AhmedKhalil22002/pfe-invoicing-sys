import { ToastPosition, TypeOptions } from 'react-toastify';

export interface ToastValidation {
  message: string;
  type?: TypeOptions;
  position?: ToastPosition;
}
