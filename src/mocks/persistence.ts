import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'prefeitura:mock-db:v1';

export type DbSnapshot = Record<string, unknown[]>;

export async function loadSnapshot(): Promise<DbSnapshot | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as DbSnapshot) : null;
}

export async function saveSnapshot(snapshot: DbSnapshot): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
