import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ApiError } from '@/shared/api/api-error';
import { buildSchool } from '@/test/factories';

import { SchoolForm } from '../components/school-form';
import { useSchoolStore } from '../store/school-store';

jest.mock('@/shared/hooks/use-app-toast', () => ({
  useAppToast: () => ({ success: jest.fn(), error: jest.fn() }),
}));

const renderForm = (props: Partial<Parameters<typeof SchoolForm>[0]> = {}) =>
  render(
    <GluestackUIProvider>
      <SchoolForm onSaved={jest.fn()} {...props} />
    </GluestackUIProvider>,
  );

describe('SchoolForm', () => {
  it('shows required field errors and does not submit', async () => {
    const createSchool = jest.fn();
    useSchoolStore.setState({ createSchool });
    await renderForm();

    await fireEvent.press(screen.getByText('Cadastrar escola'));

    expect(await screen.findByText('Informe o nome da escola')).toBeTruthy();
    expect(screen.getByText('Informe o endereço da escola')).toBeTruthy();
    expect(createSchool).not.toHaveBeenCalled();
  });

  it('submits trimmed values and notifies when saved', async () => {
    const saved = buildSchool({ name: 'Nova Escola' });
    const createSchool = jest.fn().mockResolvedValue(saved);
    const onSaved = jest.fn();
    useSchoolStore.setState({ createSchool });
    await renderForm({ onSaved });

    await fireEvent.changeText(screen.getByLabelText('Nome da escola'), '  Nova Escola ');
    await fireEvent.changeText(screen.getByLabelText('Endereço'), 'Rua A, 10');
    await fireEvent.press(screen.getByText('Cadastrar escola'));

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(saved));
    expect(createSchool).toHaveBeenCalledWith({ name: 'Nova Escola', address: 'Rua A, 10' });
  });

  it('prefills values when editing and maps server validation errors to fields', async () => {
    const school = buildSchool({ name: 'Antiga', address: 'Rua B' });
    const updateSchool = jest
      .fn()
      .mockRejectedValue(new ApiError('Dados inválidos', 422, { address: 'Endereço inválido' }));
    useSchoolStore.setState({ updateSchool });
    await renderForm({ school });

    expect(screen.getByLabelText('Nome da escola').props.value).toBe('Antiga');
    await fireEvent.press(screen.getByText('Salvar alterações'));

    expect(await screen.findByText('Endereço inválido')).toBeTruthy();
    expect(updateSchool).toHaveBeenCalledWith(school.id, { name: 'Antiga', address: 'Rua B' });
  });

  it('shows unexpected errors inside the form', async () => {
    const createSchool = jest
      .fn()
      .mockRejectedValue(new Error('Não foi possível conectar ao servidor.'));
    useSchoolStore.setState({ createSchool });
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Nome da escola'), 'Escola');
    await fireEvent.changeText(screen.getByLabelText('Endereço'), 'Rua');
    await fireEvent.press(screen.getByText('Cadastrar escola'));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível conectar ao servidor.',
    );
  });
});
