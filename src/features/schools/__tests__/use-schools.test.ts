import { act, renderHook, waitFor } from '@testing-library/react-native';

import { buildSchool } from '@/test/factories';

import { useSchools } from '../hooks/use-schools';
import { useSchoolStore } from '../store/school-store';

const lobato = buildSchool({ name: 'EMEF Monteiro Lobato', classIds: ['1', '2'] });
const rural = buildSchool({ name: 'Escola Rural Santa Luzia', classIds: [] });

describe('useSchools', () => {
  beforeEach(() =>
    useSchoolStore.setState({
      schools: [lobato, rural],
      status: 'success',
      error: null,
      fetchSchools: jest.fn().mockResolvedValue(undefined),
    }),
  );

  it('fetches on mount and exposes totals', async () => {
    const { result } = await renderHook(() => useSchools());

    expect(useSchoolStore.getState().fetchSchools).toHaveBeenCalledTimes(1);
    expect(result.current).toMatchObject({ totalSchools: 2, totalClasses: 2, isFiltering: false });
    expect(result.current.schools).toEqual([lobato, rural]);
  });

  it('applies the debounced search and the filter', async () => {
    const { result } = await renderHook(() => useSchools());

    await act(async () => result.current.setQuery('lobato'));
    await waitFor(() => expect(result.current.schools).toEqual([lobato]));
    expect(result.current.isFiltering).toBe(true);

    await act(async () => {
      result.current.setQuery('');
      result.current.setFilter('withoutClasses');
    });
    await waitFor(() => expect(result.current.schools).toEqual([rural]));
  });

  it('shows the initial loading only when there is nothing cached', async () => {
    useSchoolStore.setState({ schools: [], status: 'loading' });
    const { result } = await renderHook(() => useSchools());

    expect(result.current.isInitialLoading).toBe(true);

    await act(async () => useSchoolStore.setState({ schools: [lobato], status: 'loading' }));
    expect(result.current.isInitialLoading).toBe(false);
  });

  it('hides the error while cached schools are available', async () => {
    useSchoolStore.setState({ status: 'error', error: 'offline' });
    const { result } = await renderHook(() => useSchools());
    expect(result.current.error).toBeNull();

    await act(async () => useSchoolStore.setState({ schools: [] }));
    expect(result.current.error).toBe('offline');
  });

  it('tracks the refreshing state', async () => {
    let finish!: () => void;
    const fetchSchools = jest.fn(() => new Promise<void>((resolve) => (finish = resolve)));
    useSchoolStore.setState({ fetchSchools });
    const { result } = await renderHook(() => useSchools());
    finish();

    let refreshing!: Promise<void>;
    await act(async () => {
      refreshing = result.current.refresh();
    });
    expect(result.current.isRefreshing).toBe(true);

    await act(async () => {
      finish();
      await refreshing;
    });
    expect(result.current.isRefreshing).toBe(false);
  });
});
