import axios from 'axios';
import { API_BASE_URL, PUBLICATION_ID, headers } from './config';
import { GroupData } from '../../types/schedule';
import { logNetworkRequest, logNetworkResponse, logNetworkError } from '../../utils/logger';
import { getStartOfWeekDate } from '../../utils/dateUtils';

export const getGroupSchedule = async (groupId: number, nextWeek: boolean = false): Promise<GroupData> => {
  let startDate = getStartOfWeekDate();
  
  if (nextWeek) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 7);
    startDate = date.toLocaleDateString('en-CA');
  }

  const url = `${API_BASE_URL}/publications/group/lessons`;
  const body = {
    groupId,
    date: startDate,
    publicationId: PUBLICATION_ID,
  };

  try {
    logNetworkRequest(url, 'POST', body);
    const response = await axios.post(url, body, { headers });
    logNetworkResponse(response);
    
    if (response.status !== 200) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    return response.data;
  } catch (error) {
    logNetworkError(error);
    throw error;
  }
};