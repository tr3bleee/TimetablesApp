import { useState, useEffect } from 'react';
import { getGroupSchedule, getTeacherSchedule } from '@/app/services/api/scheduleApi';
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
        ? await getGroupSchedule(id, isNextWeek)
        : await getTeacherSchedule(id, isNextWeek);
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
    let isSubscribed = true;

    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = type === 'group'
          ? await getGroupSchedule(id, isNextWeek)
          : await getTeacherSchedule(id, isNextWeek);
        
        if (isSubscribed) {
          setSchedule(data);
        }
      } catch (err) {
        if (isSubscribed) {
          setError('Не удалось загрузить расписание');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isSubscribed = false;
    };
  }, [id, type, isNextWeek]);

  return {
    schedule,
    loading,
    error,
    isNextWeek,
    fetchSchedule,
    handleWeekChange
  };
} 