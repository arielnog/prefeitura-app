import { act, renderHook, waitFor } from '@testing-library/react-native';

import { ApiError } from '@/shared/api/api-error';
import { buildSchool } from '@/test/factories';

import { useSchool } from '../hooks/use-school';
import { useSchoolStore } from '../store/school-store';

describe('useSchool', () => {
  beforeEach(() => useSchoolStore.setState({ schools: [] }));

  it('returns the school from the store without fetching', async () => {
    const school = buildSchool();
    const fetchSchool = jest.fn();
    useSchoolStore.setState({ schools: [school], fetchSchool });

    const { result } = await renderHook(() => useSchool(school.id));

    expect(result.current.school).toEqual(school);
    expect(fetchSchool).not.toHaveBeenCalled();
  });

  it('fetches a school that is not loaded yet (deep link)', async () => {
    const school = buildSchool();
    const fetchSchool = jest.fn(async () => {
      useSchoolStore.setState({ schools: [school] });
      return school;
    });
    useSchoolStore.setState({ fetchSchool });

    const { result } = await renderHook(() => useSchool(school.id));

    expect(fetchSchool).toHaveBeenCalledWith(school.id);
    await waitFor(() => expect(result.current.school).toEqual(school));
  });

  it('reports not found on 404 and allows retrying other errors', async () => {
    const fetchSchool = jest.fn().mockRejectedValue(new ApiError('Escola não encontrada', 404));
    useSchoolStore.setState({ fetchSchool });

    const { result } = await renderHook(() => useSchool('99'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current).toMatchObject({ isNotFound: true, error: null });

    fetchSchool.mockRejectedValueOnce(new ApiError('Sem conexão', 0));
    await act(async () => result.current.retry());
    await waitFor(() => expect(result.current.error).toBe('Sem conexão'));
  });

  it('does not refetch a school that was removed from the store', async () => {
    const school = buildSchool();
    const fetchSchool = jest.fn();
    useSchoolStore.setState({ schools: [school], fetchSchool });

    const { result } = await renderHook(() => useSchool(school.id));
    await act(async () => useSchoolStore.setState({ schools: [] }));

    expect(fetchSchool).not.toHaveBeenCalled();
    expect(result.current.school).toBeUndefined();
  });
});
