import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "@/constants/colors";

export default function RootLayout() {
	return (
		<>
			<Stack
				screenOptions={{
					headerTitleStyle: {
						fontWeight: 900,
						color: COLORS.black
					},
					headerStyle: {
						backgroundColor: "white"
					},
					headerShadowVisible: false,
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
