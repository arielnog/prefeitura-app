import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { ApiError } from '@/shared/api/api-error';
import { buildSchoolClass } from '@/test/factories';

import { ClassForm } from '../components/class-form';
import { useClassStore } from '../store/class-store';

jest.mock('@/shared/hooks/use-app-toast', () => ({
  useAppToast: () => ({ success: jest.fn(), error: jest.fn() }),
}));

const currentYear = new Date().getFullYear();

const renderForm = (props: Partial<Parameters<typeof ClassForm>[0]> = {}) =>
  render(
    <GluestackUIProvider>
      <ClassForm schoolId="s1" onSaved={jest.fn()} {...props} />
    </GluestackUIProvider>,
  );

describe('ClassForm', () => {
  it('requires name and shift', async () => {
    const createClass = jest.fn();
    useClassStore.setState({ createClass });
    await renderForm();

    await fireEvent.press(screen.getByText('Cadastrar turma'));

    expect(await screen.findByText('Informe o nome da turma')).toBeTruthy();
    expect(screen.getByText('Selecione o turno')).toBeTruthy();
    expect(createClass).not.toHaveBeenCalled();
  });

  it('creates a class with the selected shift and school year', async () => {
    const saved = buildSchoolClass();
    const createClass = jest.fn().mockResolvedValue(saved);
    const onSaved = jest.fn();
    useClassStore.setState({ createClass });
    await renderForm({ onSaved });

    await fireEvent.changeText(screen.getByLabelText('Nome da turma'), '3º Ano B');
    await fireEvent.press(screen.getByRole('radio', { name: 'Tarde' }));
    await fireEvent.press(screen.getByLabelText('Próximo ano'));
    await fireEvent.press(screen.getByText('Cadastrar turma'));

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(saved));
    expect(createClass).toHaveBeenCalledWith({
      schoolId: 's1',
      name: '3º Ano B',
      shift: 'afternoon',
      schoolYear: currentYear + 1,
    });
  });

  it('updates an existing class', async () => {
    const schoolClass = buildSchoolClass({ name: '1A', shift: 'morning', schoolYear: 2025 });
    const updateClass = jest.fn().mockResolvedValue(schoolClass);
    useClassStore.setState({ updateClass });
    await renderForm({ schoolClass });

    await fireEvent.press(screen.getByRole('radio', { name: 'Integral' }));
    await fireEvent.press(screen.getByText('Salvar alterações'));

    await waitFor(() =>
      expect(updateClass).toHaveBeenCalledWith(schoolClass, {
        name: '1A',
        shift: 'full',
        schoolYear: 2025,
      }),
    );
  });

  it('shows server errors for fields the form does not display', async () => {
    const createClass = jest
      .fn()
      .mockRejectedValue(new ApiError('Dados inválidos', 422, { schoolId: 'Escola inválida' }));
    useClassStore.setState({ createClass });
    await renderForm();

    await fireEvent.changeText(screen.getByLabelText('Nome da turma'), '1A');
    await fireEvent.press(screen.getByRole('radio', { name: 'Manhã' }));
    await fireEvent.press(screen.getByText('Cadastrar turma'));

    expect(await screen.findByText('Escola inválida')).toBeTruthy();
  });
});
