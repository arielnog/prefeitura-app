jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// O Pretender (usado pelo MirageJS) intercepta `self.XMLHttpRequest`, que o runtime do RN
// define mas o ambiente do Jest não. Como toda requisição é tratada pelo mock, um stub basta.
const globals = globalThis as unknown as { self?: typeof globalThis; XMLHttpRequest?: unknown };
globals.self ??= globalThis;
globals.XMLHttpRequest ??= class XMLHttpRequestStub {};
