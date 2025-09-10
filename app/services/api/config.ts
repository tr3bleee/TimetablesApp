export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://schedule.mstimetables.ru/api',
  PUBLICATION_ID: process.env.EXPO_PUBLIC_PUBLICATION_ID || 'cdb2a14c-a891-4f9f-b56c-7e8eb559c766'
};

export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};