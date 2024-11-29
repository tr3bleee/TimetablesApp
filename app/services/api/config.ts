export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://schedule.mstimetables.ru/api',
  PUBLICATION_ID: process.env.EXPO_PUBLIC_PUBLICATION_ID || '9cdf72e4-aa1d-45e8-9fd3-faaca804ffd1'
};

export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};