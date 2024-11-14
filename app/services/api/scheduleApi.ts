import axios from 'axios';
import { API_BASE_URL, PUBLICATION_ID, headers } from './config';
import { GroupData } from '../../types/schedule';
import { logNetworkRequest, logNetworkResponse, logNetworkError } from '../../utils/logger';

export const getGroupSchedule = async (groupId: number): Promise<GroupData> => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const startDate = startOfWeek.toLocaleDateString('en-CA');

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