import { ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";

const Group0124d = () => {
	const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Группа 01-24.Д",
		});
	}, [navigation]);

	return (
		<ScrollView>
			<Text>Экран группы 01-24-d</Text>
		</ScrollView>
	);
};

export default Group0124d;
