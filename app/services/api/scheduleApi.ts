import axios from 'axios';
import { API_CONFIG, headers } from './config';
import { GroupData } from '../../types/schedule';
import { TeacherSchedule } from '@/app/types/teacher';
import { logNetworkRequest, logNetworkResponse, logNetworkError } from '../../utils/logger';
import { getStartOfWeekDate } from '../../utils/dateUtils';

export const getGroupSchedule = async (groupId: number, nextWeek: boolean = false): Promise<GroupData> => {
  let startDate = getStartOfWeekDate();
  
  if (nextWeek) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 7);
    startDate = date.toLocaleDateString('en-CA');
  }

  const url = `${API_CONFIG.BASE_URL}/publications/group/lessons`;
  const body = {
    groupId,
    date: startDate,
    publicationId: API_CONFIG.PUBLICATION_ID
  };

  try {
    logNetworkRequest(url, 'POST', body);
    const response = await axios.post(url, body, { headers });
    logNetworkResponse(response);

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    logNetworkError(error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Network error: ${error.message}`);
    }
    throw error;
  }
};

export const getTeacherSchedule = async (teacherId: number, isNextWeek: boolean = false): Promise<TeacherSchedule> => {
  let startDate = getStartOfWeekDate();
  
  if (isNextWeek) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 7);
    startDate = date.toLocaleDateString('en-CA');
  }

  const url = `${API_CONFIG.BASE_URL}/publications/teacher/lessons`;
  const body = {
    teacherId,
    date: startDate,
    publicationId: API_CONFIG.PUBLICATION_ID
  };

  try {
    logNetworkRequest(url, 'POST', body);
    const response = await axios.post(url, body, { headers });
    logNetworkResponse(response);

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    logNetworkError(error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Network error: ${error.message}`);
    }
    throw error;
  }
};