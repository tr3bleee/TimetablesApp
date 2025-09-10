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

export interface TeacherInfo {
  id: number;
  fio: string;
  position: string | null;
}

// Выполняет POST-запрос для получения данных расписания
const fetchSchedule = async (
    url: string,
    body: Record<string, any>
): Promise<any> => {
    try {
        // Логируем отправляемый запрос для отладки
        logNetworkRequest(url, 'POST', body);
        
        // Отправляем POST-запрос с данными в теле запроса
        const response = await axios.post(url, body, {headers});
        
        // Логируем полученный ответ
        logNetworkResponse(response);

        // Проверяем, что сервер вернул данные
        if (!response.data) {
            return Promise.reject(new Error('No data received from server'));
        }
        
        // Возвращаем только данные из ответа
        return response.data;
    } catch (error) {
        // Логируем ошибку для диагностики
        logNetworkError(error);
        
        // Если это ошибка axios, создаем понятное сообщение
        if (axios.isAxiosError(error)) {
            throw new Error(`Network error: ${error.message}`);
        }
        
        // Пробрасываем другие ошибки дальше
        throw error;
    }
};

// Выполняет GET-запрос для получения данных
const fetchData = async (url: string): Promise<any> => {
    try {
        // Логируем отправляемый GET-запрос
        logNetworkRequest(url, 'GET', null);
        
        // Выполняем GET-запрос без тела (только URL)
        const response = await axios.get(url, {headers});
        
        // Логируем полученный ответ
        logNetworkResponse(response);

        // Проверяем наличие данных в ответе
        if (!response.data) {
            return Promise.reject(new Error('No data received from server'));
        }
        
        // Возвращаем данные из ответа
        return response.data;
    } catch (error) {
        // Логируем ошибку для анализа
        logNetworkError(error);
        
        // Обрабатываем сетевые ошибки axios
        if (axios.isAxiosError(error)) {
            throw new Error(`Network error: ${error.message}`);
        }
        
        // Пробрасываем остальные ошибки
        throw error;
    }
};

// Вычисляет дату начала недели (текущей или следующей)
const calculateStartDate = (nextWeek: boolean): string => {
    // Получаем дату начала текущей недели (понедельник)
    const currentDate = new Date(getStartOfWeekDate());
    
    // Если нужна следующая неделя, добавляем 7 дней
    if (nextWeek) {
        currentDate.setDate(currentDate.getDate() + 7);
    }
    
    // Возвращаем дату в формате YYYY-MM-DD для API
    return currentDate.toLocaleDateString('en-CA');
};

// Получает расписание группы на текущую или следующую неделю
export const getGroupSchedule = async (groupId: number, nextWeek: boolean = false): Promise<GroupData> => {
    // Формируем URL для запроса расписания группы
    const url = `${API_CONFIG.BASE_URL}/publications/group/lessons`;
    
    // Подготавливаем данные для отправки на сервер
    const body = {
        groupId,                                    // ID группы
        date: calculateStartDate(nextWeek),         // Дата начала недели
        publicationId: API_CONFIG.PUBLICATION_ID    // ID публикации расписания
    };
    
    // Отправляем запрос и возвращаем данные расписания
    return fetchSchedule(url, body);
};

// Получает расписание преподавателя на текущую или следующую неделю
export const getTeacherSchedule = async (teacherId: number, isNextWeek: boolean = false): Promise<TeacherSchedule> => {
    // Формируем URL для запроса расписания преподавателя
    const url = `${API_CONFIG.BASE_URL}/publications/teacher/lessons`;
    
    // Подготавливаем параметры запроса
    const body = {
        teacherId,                                   // ID преподавателя
        date: calculateStartDate(isNextWeek),        // Дата начала недели
        publicationId: API_CONFIG.PUBLICATION_ID     // ID публикации
    }
    
    // Отправляем запрос и получаем расписание преподавателя
    return fetchSchedule(url, body);
};

// Получает все группы с дополнительной категоризацией по номеру
export const getGroups = async (): Promise<GroupInfo[]> => {
    // Формируем URL для получения списка всех групп
    const url = `${API_CONFIG.BASE_URL}/publications/${API_CONFIG.PUBLICATION_ID}/groups`;
    
    // Получаем сырые данные групп с сервера
    const data = await fetchData(url);
    
    // Обрабатываем каждую группу для добавления категории
    return data.map((group: GroupInfo) => {
        let category = 0;
        
        // Проверяем, является ли это группой нового формата (с точками)
        // Например: "15.ИСИП.22.О-ЗФ.0.1.ХК"
        const hasNewFormat = /^\d+\.[^.]+\./.test(group.name);
        
        if (hasNewFormat) {
            // Группы нового формата относим к категории "Другие" (0)
            category = 0;
        } else {
            // Ищем двузначное число в названии группы старого формата (например, "22" из "22-ИС-1")
            const matches = group.name.match(/^(\d{2})|[\s-](\d{2})/);
            if (matches) {
                // Извлекаем номер группы из найденного совпадения
                const groupNumber = matches[1] || matches[2];
                if (groupNumber) {
                    // Преобразуем строку в число для категоризации
                    category = parseInt(groupNumber, 10);
                }
            }
        }
        
        // Возвращаем группу с добавленной категорией
        return {
            ...group,
            category
        };
    });
};

// Получает список всех преподавателей
export const getTeachers = async (): Promise<TeacherInfo[]> => {
    // Формируем URL для запроса списка преподавателей
    const url = `${API_CONFIG.BASE_URL}/publications/${API_CONFIG.PUBLICATION_ID}/teachers`;
    
    // Выполняем GET-запрос и возвращаем список преподавателей
    return fetchData(url);
};