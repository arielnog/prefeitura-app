import { useWindowDimensions } from 'react-native';

const TABLET_MIN_WIDTH = 768;
const WIDE_MIN_WIDTH = 1100;

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_MIN_WIDTH;
  const columns = width >= WIDE_MIN_WIDTH ? 3 : isTablet ? 2 : 1;

  return { width, isTablet, columns };
}
