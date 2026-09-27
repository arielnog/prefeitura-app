import '@/global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useMockServer } from '@/shared/hooks/use-mock-server';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const ready = useMockServer();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="system">
        <Stack />
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
