import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function getApiErrorMessage(
  error,
  fallback = 'Une erreur est survenue. Veuillez réessayer.',
) {
  if (!error?.response) {
    return 'Impossible de joindre le serveur. Veuillez réessayer plus tard.';
  }

  const message = error.response.data?.error;

  return typeof message === 'string' && message ? message : fallback;
}
