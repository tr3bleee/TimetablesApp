import { TeacherInfo } from './teacher';
import { GroupInfo } from '@/constants/groups';

export interface TeacherListProps {
  teachers: TeacherInfo[];
  onSelectTeacher: (teacher: TeacherInfo) => void;
  selectedTeacher?: TeacherInfo;
}

export interface GroupListProps {
  groups: GroupInfo[];
  onSelectGroup: (group: GroupInfo) => void;
} 