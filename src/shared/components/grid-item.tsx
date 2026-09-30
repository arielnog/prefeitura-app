import type { ReactNode } from 'react';
import { View } from 'react-native';

export function GridItem({ width, children }: { width?: number; children: ReactNode }) {
  return <View style={width ? { width } : { flex: 1 }}>{children}</View>;
}
