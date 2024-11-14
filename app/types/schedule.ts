export interface Subject {
  id: string;
  name: string;
  infoUrl: string | null;
  publication: null | object;
}

export interface Lesson {
  id: string;
  weekday: number;
  lesson: number;
  startTime: string;
  endTime: string;
  teachers: Array<{ fio: string }>;
  subject: Subject | null;
}

export interface GroupData {
  startDate: string;
  endDate: string;
  group: {
    id: number;
    name: string;
  };
  lessons: Lesson[] | null;
}