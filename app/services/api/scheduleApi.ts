import axios from 'axios';
import {API_CONFIG, headers} from './config';
import {GroupData} from '../../types/schedule';
import {TeacherSchedule} from '@/app/types/teacher';
import {getStartOfWeekDate} from '../../utils/dateUtils';
import {logNetworkRequest, logNetworkResponse, logNetworkError} from '../../utils/logger';

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