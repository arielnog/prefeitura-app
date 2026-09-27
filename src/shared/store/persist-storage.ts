import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** Storage do Zustand sobre AsyncStorage: mantém o último estado conhecido para uso offline. */
export const persistStorage = createJSONStorage(() => AsyncStorage);
