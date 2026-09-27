export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.prefeitura.local',
  useMock: process.env.EXPO_PUBLIC_USE_MOCK !== 'false',
} as const;
