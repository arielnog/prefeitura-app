import { act, renderHook } from '@testing-library/react-native';

import { buildSchoolClass } from '@/test/factories';

import { useDeleteClass } from '../hooks/use-delete-class';
import { useClassStore } from '../store/class-store';

const mockToast = { success: jest.fn(), error: jest.fn() };
jest.mock('@/shared/hooks/use-app-toast', () => ({ useAppToast: () => mockToast }));

describe('useDeleteClass', () => {
  const schoolClass = buildSchoolClass();

  beforeEach(() => jest.clearAllMocks());

  it('deletes the requested class after confirmation', async () => {
    const deleteClass = jest.fn().mockResolvedValue(undefined);
    useClassStore.setState({ deleteClass });
    const { result } = await renderHook(() => useDeleteClass());

    await act(async () => result.current.request(schoolClass));
    await act(async () => result.current.confirm());

    expect(deleteClass).toHaveBeenCalledWith(schoolClass);
    expect(result.current.target).toBeNull();
    expect(mockToast.success).toHaveBeenCalledWith('Turma excluída');
  });

  it('keeps the class selected and reports the error on failure', async () => {
    useClassStore.setState({ deleteClass: jest.fn().mockRejectedValue(new Error('offline')) });
    const { result } = await renderHook(() => useDeleteClass());

    await act(async () => result.current.request(schoolClass));
    await act(async () => result.current.confirm());

    expect(result.current).toMatchObject({ target: schoolClass, isDeleting: false });
    expect(mockToast.error).toHaveBeenCalledWith('offline');
  });
});
