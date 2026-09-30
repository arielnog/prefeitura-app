import '@/global.css';

import { Stack } from 'expo-router';

import { AppProviders } from '@/shared/providers/app-providers';

const formModal = { presentation: 'modal' } as const;

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen name="index" options={{ title: 'Escolas', headerLargeTitle: true }} />
        <Stack.Screen name="schools/[id]/index" options={{ title: '' }} />
        <Stack.Screen name="schools/new" options={{ ...formModal, title: 'Nova escola' }} />
        <Stack.Screen name="schools/[id]/edit" options={{ ...formModal, title: 'Editar escola' }} />
        <Stack.Screen
          name="schools/[id]/classes/new"
          options={{ ...formModal, title: 'Nova turma' }}
        />
        <Stack.Screen
          name="schools/[id]/classes/[classId]/edit"
          options={{ ...formModal, title: 'Editar turma' }}
        />
      </Stack>
    </AppProviders>
  );
}
