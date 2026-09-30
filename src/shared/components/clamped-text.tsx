import type { ComponentProps } from 'react';
import { Text } from 'react-native';

export function ClampedText({ lines, ...props }: ComponentProps<typeof Text> & { lines: number }) {
  return <Text numberOfLines={lines} {...props} />;
}
