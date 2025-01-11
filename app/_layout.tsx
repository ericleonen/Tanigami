import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "@/constants/colors";
import TopAppBar from "@/components/TopAppBar";

export default function RootLayout() {
	return (
		<>
			<Stack
				screenOptions={{
					header: (({ options }) => 
						<TopAppBar title={options.title || ""}/>
					)
				}}
			>
				<Stack.Screen 
					name="index"
					options={{
						headerShown: false
					}}
				/>
				<Stack.Screen 
					name="play/levels"
					options={{
						title: "LEVELS"
					}}
				/>
			</Stack>
			<StatusBar style="light" />
		</>
	)
}
