import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'onboarding:hasSeen';

let cachedHasSeenOnboarding: boolean | null = null;

export async function loadHasSeenOnboarding(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  cachedHasSeenOnboarding = value === 'true';
  return cachedHasSeenOnboarding;
}

export function getHasSeenOnboarding(): boolean {
  return cachedHasSeenOnboarding ?? false;
}

export async function markOnboardingSeen(): Promise<void> {
  cachedHasSeenOnboarding = true;
  await AsyncStorage.setItem(STORAGE_KEY, 'true');
}
