import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import TopAppBar from "@/components/TopAppBar";
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from "expo-font";
import { Outfit_400Regular, Outfit_700Bold, Outfit_900Black } from "@expo-google-fonts/outfit"

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Outfit_400Regular,
		Outfit_700Bold,
		Outfit_900Black
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

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
