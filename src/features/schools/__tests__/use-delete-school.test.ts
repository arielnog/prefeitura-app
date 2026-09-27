import { act, renderHook } from '@testing-library/react-native';

import { buildSchool } from '@/test/factories';

import { useDeleteSchool } from '../hooks/use-delete-school';
import { useSchoolStore } from '../store/school-store';

const mockToast = { success: jest.fn(), error: jest.fn() };
jest.mock('@/shared/hooks/use-app-toast', () => ({ useAppToast: () => mockToast }));

describe('useDeleteSchool', () => {
  const school = buildSchool();

  beforeEach(() => jest.clearAllMocks());

  it('only deletes after confirmation, then notifies', async () => {
    const deleteSchool = jest.fn().mockResolvedValue(undefined);
    const onDeleted = jest.fn();
    useSchoolStore.setState({ deleteSchool });
    const { result } = await renderHook(() => useDeleteSchool(onDeleted));

    await act(async () => result.current.request(school));
    expect(result.current.target).toEqual(school);
    expect(deleteSchool).not.toHaveBeenCalled();

    await act(async () => result.current.confirm());

    expect(deleteSchool).toHaveBeenCalledWith(school.id);
    expect(result.current).toMatchObject({ target: null, isDeleting: false });
    expect(mockToast.success).toHaveBeenCalledWith('Escola excluída');
    expect(onDeleted).toHaveBeenCalled();
  });

  it('keeps the dialog open and shows the error when deletion fails', async () => {
    useSchoolStore.setState({ deleteSchool: jest.fn().mockRejectedValue(new Error('offline')) });
    const onDeleted = jest.fn();
    const { result } = await renderHook(() => useDeleteSchool(onDeleted));

    await act(async () => result.current.request(school));
    await act(async () => result.current.confirm());

    expect(result.current.target).toEqual(school);
    expect(mockToast.error).toHaveBeenCalledWith('offline');
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it('cancels without deleting', async () => {
    const deleteSchool = jest.fn();
    useSchoolStore.setState({ deleteSchool });
    const { result } = await renderHook(() => useDeleteSchool());

    await act(async () => result.current.request(school));
    await act(async () => result.current.cancel());

    expect(result.current.target).toBeNull();
    expect(deleteSchool).not.toHaveBeenCalled();
  });
});
