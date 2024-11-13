import axios from "axios";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Subject {
	id: string;
	name: string;
	infoUrl: string | null;
	publication: null | object;
}

interface Lesson {
	id: string;
	weekday: number;
	lesson: number;
	startTime: string;
	endTime: string;
	teachers: Array<{ fio: string }>;
	subject: Subject | null;
}

interface GroupData {
	startDate: string;
	endDate: string;
	group: {
		id: number;
		name: string;
	};
	lessons: Lesson[] | null;
}

const Group0124dScreen: React.FC = () => {
	const [data, setData] = useState<GroupData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation();

	useLayoutEffect(() => {
		if (data) {
			navigation.setOptions({
				title: data.group?.name || "N/A",
			});
		}
	}, [navigation, data]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const currentDate = new Date();
				const dayOfWeek = currentDate.getDay();
				const startOfWeek = new Date(currentDate);
				startOfWeek.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
				const startDate = startOfWeek.toLocaleDateString('en-CA');

				const response = await axios.post(
					"https://schedule.mstimetables.ru/api/publications/group/lessons",
					{
						groupId: 4,
						date: startDate,
						publicationId: "9cdf72e4-aa1d-45e8-9fd3-faaca804ffd1",
					},
					{
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
					}
				);

				if (response.status === 200) {
					setData(response.data);
				} else {
					setError("Ошибка сервера");
				}
			} catch (err) {
				setError("Ошибка при загрузке данных");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const daysOfWeek = [
		"Понедельник",
		"Вторник",
		"Среда",
		"Четверг",
		"Пятница",
		"Суббота",
		"Воскресенье",
	];

	const groupedLessons = data?.lessons?.reduce(
		(acc: { [key: number]: Lesson[] }, lesson) => {
			if (!acc[lesson.weekday]) {
				acc[lesson.weekday] = [];
			}
			acc[lesson.weekday].push(lesson);
			return acc;
		},
		{}
	);

	const sections = Object.keys(groupedLessons || {}).map((day) => ({
		title: daysOfWeek[parseInt(day) - 1],
		data: groupedLessons ? groupedLessons[parseInt(day)] : [],
	}));

	const renderLesson = ({ item }: { item: Lesson }) => {
		const subjectName = item.subject ? item.subject.name : "Без предмета";
		const teacherNames =
			item.teachers.map((teacher) => teacher.fio).join(", ") ||
			"Без преподавателя";

		return (
			<View style={styles.item}>
				<Text style={styles.title}>{subjectName}</Text>
				<Text style={styles.text}>Начало: {item.startTime}</Text>
				<Text style={styles.text}>Конец: {item.endTime}</Text>
				<Text style={styles.text}>Преподаватель: {teacherNames}</Text>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			{loading && <Text style={styles.message}>Загрузка...</Text>}
			{error && <Text style={styles.error}>Ошибка: {error}</Text>}
			{!loading && !error && data?.lessons && data.lessons.length > 0 && (
				<View>
					<Text style={styles.title}>Группа: {data.group?.name || "N/A"}</Text>
					<Text style={styles.title}>
						Начало недели:{" "}
						{data.startDate ? data.startDate.split("T")[0] : "N/A"}
					</Text>
					<SectionList
						sections={sections}
						renderItem={renderLesson}
						keyExtractor={(item) => item.id}
						renderSectionHeader={({ section: { title } }) => (
							<View style={styles.sectionHeader}>
								<Text style={styles.dayTitle}>{title}</Text>
							</View>
						)}
						contentContainerStyle={{ paddingBottom: 65 }}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f0f0f0",
	},
	item: {
		backgroundColor: "#fff",
		padding: 15,
		marginVertical: 4,
		borderRadius: 5,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	text: {
		fontSize: 16,
	},
	sectionHeader: {
		paddingTop: 15,
		paddingBottom: 5,
		backgroundColor: "#f0f0f0",
	},
	dayTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "blue",
	},
	message: {
		marginTop: 10,
		fontSize: 16,
	},
	error: {
		marginTop: 10,
		fontSize: 16,
		color: "red",
	},
});

export default Group0124dScreen;
