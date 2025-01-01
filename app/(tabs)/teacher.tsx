import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TeacherList } from '@/components/TeacherList';
import { TeacherInfo } from '@/app/types/teacher';
import { TEACHERS } from '@/constants/teachers';

export default function TeacherScreen() {
  const router = useRouter();

  const handleTeacherSelect = (teacher: TeacherInfo) => {
    router.push(`/teacher/${teacher.id}`);
  };

  return (
    <View style={styles.container}>
      <TeacherList
        teachers={TEACHERS}
        onSelectTeacher={handleTeacherSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
}); 