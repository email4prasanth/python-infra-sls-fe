import * as usePasswordHook from '@/lumifi/hooks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { ForgotPassword } from './ForgotPassword';

vi.mock('@/lumifi/hooks', async () => {
  const actual = await vi.importActual('@/lumifi/hooks');
  return {
    ...actual,
    usePassword: vi.fn(() => ({
      isSendingResetLink: false,
      sendResetPasswordLink: vi.fn(),
    })),
  };
});

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={['/forgot-password']}>
      <Routes>
        <Route
          path='/forgot-password'
          element={<ForgotPassword />}
        />
        <Route
          path='/login'
          element={<div>Login Page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
};

describe('<ForgotPassword />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the email input and buttons', () => {
    renderWithRouter();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  });

  // it('shows validation error on invalid email', async () => {
  //   renderWithRouter();
  //   const emailInput = screen.getByTestId('email');
  //   fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
  //   fireEvent.blur(emailInput);

  //   await waitFor(() => {
  //     expect(screen.getByText((text) => text.toLowerCase().includes('invalid'))).toBeInTheDocument();
  //   });
  // });

  it('disables reset button if email is empty', () => {
    renderWithRouter();
    const resetButton = screen.getByTestId('reset-button');
    expect(resetButton).toBeDisabled();
  });

  it('calls sendResetPasswordLink on valid submit', async () => {
    const mockSend = vi.fn();
    (usePasswordHook.usePassword as unknown as Mock).mockReturnValue({
      isSendingResetLink: false,
      sendResetPasswordLink: mockSend,
    });

    renderWithRouter();

    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'user@example.com' },
    });

    const resetButton = screen.getByTestId('reset-button');
    expect(resetButton).toBeEnabled();
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mockSend).toHaveBeenCalledWith('user@example.com');
    });
  });

  it('navigates to login page on cancel', async () => {
    renderWithRouter();
    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.getByText(/login page/i)).toBeInTheDocument();
    });
  });
});
