export const getStartOfWeekDate = (): string => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  return startOfWeek.toLocaleDateString('en-CA');
};

export const DAYS_OF_WEEK = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

export const getWeekDates = (startDate: string): string[] => {
  const start = new Date(startDate);
  const weekDates = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    weekDates.push(date.toLocaleDateString('ru-RU', { 
      day: 'numeric',
      month: 'numeric' 
    }));
  }
  
  return weekDates;
};