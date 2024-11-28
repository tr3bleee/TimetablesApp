import { Lesson } from './schedule';

export interface TeacherInfo {
  id: number;
  fio: string;
  position: string | null;
}

export interface TeacherSchedule {
  startDate: string;
  endDate: string;
  teacher: TeacherInfo;
  lessons: Array<{
    id: string;
    weekday: number;
    lesson: number;
    startTime: string;
    endTime: string;
    startTimeMin: number;
    endTimeMin: number;
    cabinet: {
      id: number;
      name: string;
      shortName: string;
      ignore: boolean;
      publication: null;
    } | null;
    subject: {
      id: number;
      name: string;
      infoUrl: string | null;
      publication: null;
    } | null;
    teachers: Array<{
      id: number;
      fio: string;
      position: string | null;
      lessons: null;
      publication: null;
    }>;
    unionGroups: Array<{
      id: string;
      group: {
        id: number;
        name: string;
      };
      subgroup: null;
    }>;
    typeLesson: null;
  }>;
} 