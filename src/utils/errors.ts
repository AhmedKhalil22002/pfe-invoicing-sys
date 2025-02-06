import axios, { AxiosError } from 'axios';
import i18next from 'i18next';

export function getErrorMessage(
  namespace: string,
  error: Error | AxiosError,
  defaultValue?: string
) {
  if (!i18next.isInitialized) {
    i18next.init({
      lng: 'en',
      fallbackLng: 'en',
      ns: [namespace],
      defaultNS: namespace
    });
  }

  const tranzinc = (key: string) => i18next.t(key, { ns: namespace });

  if (axios.isAxiosError(error)) {
    const errorMessage = Array.isArray(error.response?.data?.message)
      ? error.response?.data?.message[0]
      : error.response?.data?.message;

    return tranzinc(errorMessage || defaultValue || '');
  }

  if (error instanceof Error) {
    return tranzinc(error.message) || defaultValue || 'Unexpected Error';
  }

  return defaultValue || 'Unexpected Error';
}
