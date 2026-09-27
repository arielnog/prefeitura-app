import type { ReactNode } from 'react';
import { View } from 'react-native';

/** Célula de grade com largura fixa (em 1 coluna ocupa a linha inteira). */
export function GridItem({ width, children }: { width?: number; children: ReactNode }) {
  return <View style={width ? { width } : { flex: 1 }}>{children}</View>;
}
