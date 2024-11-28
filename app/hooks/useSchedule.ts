import { useState, useEffect } from 'react';
import scheduleApi from '@/app/services/api/scheduleApi';
import { GroupData } from '@/app/types/schedule';
import { TeacherSchedule } from '@/app/types/teacher';

type ScheduleType = GroupData | TeacherSchedule;

interface UseScheduleProps {
  type: 'group' | 'teacher';
  id: number;
}

export function useSchedule({ type, id }: UseScheduleProps) {
  const [schedule, setSchedule] = useState<ScheduleType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNextWeek, setIsNextWeek] = useState(false);

  const fetchSchedule = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = type === 'group' 
        ? await scheduleApi.getGroupSchedule(id, isNextWeek)
        : await scheduleApi.getTeacherSchedule(id, isNextWeek);
      setSchedule(data);
    } catch (err) {
      setError('Не удалось загрузить расписание');
      console.error(`Error fetching ${type} schedule:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleWeekChange = (isNext: boolean) => {
    setIsNextWeek(isNext);
  };

  useEffect(() => {
    if (id) {
      fetchSchedule();
    }
  }, [id, isNextWeek]);

  return {
    schedule,
    loading,
    error,
    isNextWeek,
    fetchSchedule,
    handleWeekChange
  };
} 