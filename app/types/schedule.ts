
export interface Subject {
  id: string;
  name: string;
  infoUrl: string | null;
  publication: Publication | null;
}

export interface Cabinet {
  id: number;
  name: string;
  shortName: string;
  ignore: boolean;
  publication: null | object;
}

export interface Subgroup {
  id: number;
  name: string;
  order: number;
}

export interface UnionGroup {
  id: string;
  group: {
    id: number;
    name: string;
  };
  subgroup: Subgroup;
  divisionId: number;
  countDivisions: number;
}

export interface Lesson {
  id: string;
  weekday: number;
  lesson: number;
  startTime: string;
  endTime: string;
  teachers: Array<{ id: number; fio: string }>;
  subject: Subject | null;
  cabinet: Cabinet | null;
  unionGroups: UnionGroup[];
}

// Базовый интерфейс для общих свойств
export interface BaseSchedule {
  startDate: string;
  lessons: Lesson[] | null;
}

export interface GroupData extends BaseSchedule {
  group: {
    id: number;
    name: string;
  };
}

export interface TeacherSchedule extends BaseSchedule {
  id: number;
}

// Add more specific types for publication
interface Publication {
  id: string;
  // Add other publication properties
}