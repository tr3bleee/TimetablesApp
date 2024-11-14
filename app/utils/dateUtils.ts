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