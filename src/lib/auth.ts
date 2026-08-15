import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'auth:hasSession';

let cachedHasSession: boolean | null = null;

export async function loadHasSession(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  cachedHasSession = value === 'true';
  return cachedHasSession;
}

export function getHasSession(): boolean {
  return cachedHasSession ?? false;
}

export async function markSessionActive(): Promise<void> {
  cachedHasSession = true;
  await AsyncStorage.setItem(STORAGE_KEY, 'true');
}

export async function clearSession(): Promise<void> {
  cachedHasSession = false;
  await AsyncStorage.removeItem(STORAGE_KEY);
}
