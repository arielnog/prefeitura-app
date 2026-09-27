import '@/global.css';

import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useMockServer } from '@/shared/hooks/use-mock-server';
import { darkNavigationTheme, lightNavigationTheme } from '@/shared/theme/navigation-theme';

SplashScreen.preventAutoHideAsync();

const formSheet = {
  presentation: 'formSheet' as const,
  sheetAllowedDetents: [0.6, 1],
  sheetGrabberVisible: true,
  sheetCornerRadius: 24,
};

export default function RootLayout() {
  const ready = useMockServer();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode="system">
        <ThemeProvider value={colorScheme === 'dark' ? darkNavigationTheme : lightNavigationTheme}>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{ headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal' }}
          >
            <Stack.Screen name="index" options={{ title: 'Escolas', headerLargeTitle: true }} />
            <Stack.Screen name="schools/[id]/index" options={{ title: '' }} />
            <Stack.Screen name="schools/new" options={{ ...formSheet, title: 'Nova escola' }} />
            <Stack.Screen
              name="schools/[id]/edit"
              options={{ ...formSheet, title: 'Editar escola' }}
            />
          </Stack>
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
