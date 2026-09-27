import { useWindowDimensions } from 'react-native';

const TABLET_MIN_WIDTH = 768;
const WIDE_MIN_WIDTH = 1100;
export const GRID_GAP = 12;

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const columns = width >= WIDE_MIN_WIDTH ? 3 : isTablet ? 2 : 1;
  const horizontalPadding = isTablet ? 32 : 16;
  // Largura fixa por item: sem ela, o último item de uma linha incompleta estica (flex-1).
  const itemWidth =
    columns > 1
      ? Math.floor((width - horizontalPadding * 2 - GRID_GAP * (columns - 1)) / columns)
      : undefined;

  return { width, isTablet, columns, horizontalPadding, itemWidth };
}
