import { act, renderHook, waitFor } from '@testing-library/react-native';

import { buildSchoolClass } from '@/test/factories';

import { useSchoolClass } from '../hooks/use-school-class';
import { useSchoolClasses } from '../hooks/use-school-classes';
import { useClassStore } from '../store/class-store';

const morning = buildSchoolClass({ schoolId: 's1', name: '1º Ano A', shift: 'morning' });
const evening = buildSchoolClass({ schoolId: 's1', name: 'EJA', shift: 'evening' });

describe('useSchoolClasses', () => {
  beforeEach(() =>
    useClassStore.setState({
      classesBySchool: { s1: [morning, evening] },
      statusBySchool: { s1: 'success' },
      errorBySchool: {},
      fetchClasses: jest.fn().mockResolvedValue(undefined),
    }),
  );

  it('fetches the classes of the school on mount', async () => {
    const { result } = await renderHook(() => useSchoolClasses('s1'));

    expect(useClassStore.getState().fetchClasses).toHaveBeenCalledWith('s1');
    expect(result.current.classes).toEqual([morning, evening]);
    expect(result.current.totalClasses).toBe(2);
  });

  it('filters by shift and search, and clears the filters', async () => {
    const { result } = await renderHook(() => useSchoolClasses('s1'));

    await act(async () => result.current.setShift('evening'));
    expect(result.current.classes).toEqual([evening]);

    await act(async () => {
      result.current.setShift('all');
      result.current.setQuery('1º ano');
    });
    await waitFor(() => expect(result.current.classes).toEqual([morning]));

    await act(async () => result.current.clearFilters());
    await waitFor(() => expect(result.current.isFiltering).toBe(false));
    expect(result.current.classes).toHaveLength(2);
  });

  it('exposes loading and error states of a school without cached classes', async () => {
    useClassStore.setState({ classesBySchool: {}, statusBySchool: { s1: 'loading' } });
    const { result } = await renderHook(() => useSchoolClasses('s1'));
    expect(result.current.isInitialLoading).toBe(true);

    await act(async () =>
      useClassStore.setState({ statusBySchool: { s1: 'error' }, errorBySchool: { s1: 'offline' } }),
    );
    expect(result.current).toMatchObject({ isInitialLoading: false, error: 'offline' });
  });
});

describe('useSchoolClass', () => {
  it('returns a cached class without fetching', async () => {
    const fetchClasses = jest.fn();
    useClassStore.setState({
      classesBySchool: { s1: [morning] },
      statusBySchool: {},
      fetchClasses,
    });

    const { result } = await renderHook(() => useSchoolClass('s1', morning.id));

    expect(result.current.schoolClass).toEqual(morning);
    expect(fetchClasses).not.toHaveBeenCalled();
  });

  it('loads the classes of the school when the class is not cached (deep link)', async () => {
    const fetchClasses = jest.fn(async (schoolId: string) => {
      useClassStore.setState({
        classesBySchool: { [schoolId]: [morning] },
        statusBySchool: { [schoolId]: 'success' },
      });
    });
    useClassStore.setState({ classesBySchool: {}, statusBySchool: {}, fetchClasses });

    const { result } = await renderHook(() => useSchoolClass('s1', morning.id));

    expect(fetchClasses).toHaveBeenCalledWith('s1');
    await waitFor(() => expect(result.current.schoolClass).toEqual(morning));
  });

  it('reports not found once the classes were loaded without it', async () => {
    useClassStore.setState({
      classesBySchool: { s1: [] },
      statusBySchool: { s1: 'success' },
      fetchClasses: jest.fn(),
    });

    const { result } = await renderHook(() => useSchoolClass('s1', 'missing'));

    expect(result.current).toMatchObject({ schoolClass: undefined, isLoading: false, error: null });
  });
});
