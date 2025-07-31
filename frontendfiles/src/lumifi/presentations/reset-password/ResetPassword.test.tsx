import * as usePasswordHook from '@/lumifi/hooks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ResetPassword } from './ResetPassword';

vi.mock('@/lumifi/hooks', async () => {
  const actual = await vi.importActual('@/lumifi/hooks');
  return {
    ...actual,
    usePassword: vi.fn(() => ({
      isResettingPassword: false,
      resetPassword: vi.fn(),
    })),
  };
});

const renderWithRouter = (route: string = '/reset-password?credential=abc123') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route
          path='/reset-password'
          element={<ResetPassword />}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('<ResetPassword />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all fields and buttons', () => {
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

  it('calls resetPassword on valid submit', async () => {
    const mockResetPassword = vi.fn();
    (usePasswordHook.usePassword as unknown as Mock).mockReturnValue({
      isResettingPassword: false,
      resetPassword: mockResetPassword,
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
      expect(mockResetPassword).toHaveBeenCalledWith(
        {
          credential: 'abc123',
          password: 'Password1!',
        },
        expect.any(Function)
      );
    });
  });
});
