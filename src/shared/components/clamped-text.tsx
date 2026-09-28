import type { ComponentProps } from 'react';
import { Text } from 'react-native';

/**
 * Texto com limite de linhas. Usa o `Text` do React Native porque o `Text` do Gluestack
 * vira um `<span>` puro no web, onde `numberOfLines` não existe.
 */
export function ClampedText({ lines, ...props }: ComponentProps<typeof Text> & { lines: number }) {
  return <Text numberOfLines={lines} {...props} />;
}
