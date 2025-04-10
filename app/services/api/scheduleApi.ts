import { TeacherSchedule } from '@/app/types/teacher';
import axios from 'axios';
import { GroupData } from '../../types/schedule';
import { getStartOfWeekDate } from '../../utils/dateUtils';
import { logNetworkError, logNetworkRequest, logNetworkResponse } from '../../utils/logger';
import { API_CONFIG, headers } from './config';

export interface GroupInfo {
  id: number;
  name: string;
  category?: number;
}

const fetchSchedule = async (
    url: string,
    body: Record<string, any>
): Promise<any> => {
    try {
        logNetworkRequest(url, 'POST', body);
        const response = await axios.post(url, body, {headers});
        logNetworkResponse(response);

        if (!response.data) {
            return Promise.reject(new Error('No data received from server'));
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

const calculateStartDate = (nextWeek: boolean): string => {
    const currentDate = new Date(getStartOfWeekDate());
    if (nextWeek) {
        currentDate.setDate(currentDate.getDate() + 7);
    }
    return currentDate.toLocaleDateString('en-CA');
};

export const getGroupSchedule = async (groupId: number, nextWeek: boolean = false): Promise<GroupData> => {
    const url = `${API_CONFIG.BASE_URL}/publications/group/lessons`;
    const body = {
        groupId,
        date: calculateStartDate(nextWeek),
        publicationId: API_CONFIG.PUBLICATION_ID
    };
    return fetchSchedule(url, body);
};

export const getTeacherSchedule = async (teacherId: number, isNextWeek: boolean = false): Promise<TeacherSchedule> => {
    const url = `${API_CONFIG.BASE_URL}/publications/teacher/lessons`;
    const body = {
        teacherId,
        date: calculateStartDate(isNextWeek),
        publicationId: API_CONFIG.PUBLICATION_ID
    }
    return fetchSchedule(url, body);
};

export const getGroups = async (): Promise<GroupInfo[]> => {
    try {
        const url = `${API_CONFIG.BASE_URL}/publications/${API_CONFIG.PUBLICATION_ID}/groups`;
        logNetworkRequest(url, 'GET', null);
        const response = await axios.get(url, {headers});
        logNetworkResponse(response);

        if (!response.data) {
            return Promise.reject(new Error('No data received from server'));
        }
        
        // Classify groups based on their names
        return response.data.map((group: GroupInfo) => {
            let category = 0;
            
            // Extract the first two digits at the beginning of the group name
            // This pattern looks for 2 digits at the start of the name or after a space
            const matches = group.name.match(/^(\d{2})|[\s-](\d{2})/);
            if (matches) {
                // Find which capturing group matched (either the first or second set of parentheses)
                const groupNumber = matches[1] || matches[2];
                if (groupNumber) {
                    // Convert string like "01" to number 1, "08" to 8, etc.
                    category = parseInt(groupNumber, 10);
                }
            }
            
            return {
                ...group,
                category
            };
        });
    } catch (error) {
        logNetworkError(error);
        if (axios.isAxiosError(error)) {
            throw new Error(`Network error: ${error.message}`);
        }
        throw error;
    }
};