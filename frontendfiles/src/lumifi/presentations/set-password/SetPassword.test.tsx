import * as usePasswordHook from '@/lumifi/hooks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { SetPassword } from './SetPassword';

vi.mock('@/lumifi/hooks', async () => {
  const actual = await vi.importActual('@/lumifi/hooks');
  return {
    ...actual,
    usePassword: vi.fn(() => ({
      isSettingPassword: false,
      setPassword: vi.fn(),
    })),
  };
});

const renderWithRouter = (route: string = '/set-password?context=RP&credential=abc123') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path='/set-password'
          element={<SetPassword />}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('<SetPassword />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form fields', () => {
    renderWithRouter();

    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('confirmPassword')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    renderWithRouter();

    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();
  });

  it('calls setPassword on valid submit', async () => {
    const mockSetPassword = vi.fn();
    (usePasswordHook.usePassword as unknown as Mock).mockReturnValue({
      isSettingPassword: false,
      setPassword: mockSetPassword,
    });

    renderWithRouter();

    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Password1!' },
    });
    fireEvent.change(screen.getByTestId('confirmPassword'), {
      target: { value: 'Password1!' },
    });

    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSetPassword).toHaveBeenCalledWith(
        {
          credential: 'abc123',
          password: 'Password1!',
        },
        expect.any(Function)
      );
    });
  });
});
