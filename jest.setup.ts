jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

const globals = globalThis as unknown as { self?: typeof globalThis; XMLHttpRequest?: unknown };
globals.self ??= globalThis;
globals.XMLHttpRequest ??= class XMLHttpRequestStub {};
