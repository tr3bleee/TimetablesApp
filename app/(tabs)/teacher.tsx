import { TeacherInfo } from '@/app/services/api/scheduleApi';
import { TeacherList } from '@/components/TeacherList';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function TeacherScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleTeacherSelect = (teacher: TeacherInfo) => {
    router.push(`/teacher/${teacher.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TeacherList
        onSelectTeacher={handleTeacherSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});