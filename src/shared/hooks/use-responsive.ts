import { useWindowDimensions } from 'react-native';

const TABLET_MIN_WIDTH = 768;
const WIDE_MIN_WIDTH = 1100;
const GRID_GAP = 12;

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const columns = width >= WIDE_MIN_WIDTH ? 3 : isTablet ? 2 : 1;
  const horizontalPadding = isTablet ? 32 : 16;
  const itemWidth =
    columns > 1
      ? Math.floor((width - horizontalPadding * 2 - GRID_GAP * (columns - 1)) / columns)
      : undefined;

  return { columns, horizontalPadding, itemWidth };
}
