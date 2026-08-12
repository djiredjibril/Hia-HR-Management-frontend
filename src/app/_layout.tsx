import '@/global.css';

import {
  Quicksand_300Light,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
  useFonts,
} from '@expo-google-fonts/quicksand';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';

import { loadHasSeenOnboarding } from '@/lib/onboarding';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [fontsLoaded] = useFonts({
    Quicksand_300Light,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    loadHasSeenOnboarding().finally(() => setOnboardingChecked(true));
  }, []);

  useEffect(() => {
    if (fontsLoaded && onboardingChecked) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, onboardingChecked]);

  if (!fontsLoaded || !onboardingChecked) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
