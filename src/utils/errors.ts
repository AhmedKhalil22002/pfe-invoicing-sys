import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any, defaultValue?: string) {
  if (axios.isAxiosError(error)) {
    return (
      (Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message[0]
        : error.response?.data?.message) ||
      defaultValue ||
      "Erreur lors de l'envoie de la requête"
    );
  }

  if (error instanceof Error) {
    return error.message || defaultValue;
  }
  return defaultValue || 'Unexpected Error';
}
