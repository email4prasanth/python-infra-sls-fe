import * as useLoginHook from '@/lumifi/hooks';
import rootReducer from '@/store/reducer';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { Login } from './Login';

vi.mock('@/lumifi/hooks', async () => {
  const actual = await vi.importActual('@/lumifi/hooks');
  return {
    ...actual,
    useUserLogin: vi.fn(() => ({
      isLoginLoading: false,
      postUserLogin: vi.fn(),
      authCompletion: vi.fn(),
      selectUserPracticeAccount: vi.fn(),
    })),
  };
});

const renderWithRouter = () => {
  const store = configureStore({ reducer: rootReducer });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/forgot-password'
            element={<div>Forgot Password Page</div>}
          />
          <Route
            path='/welcome'
            element={<div>Welcome Page</div>}
          />
          <Route
            path='/home'
            element={<div>Home Page</div>}
          />
          <Route
            path='/verification-pending/:account'
            element={<div>Verification Pending Page</div>}
          />
          <Route
            path='/select-practice-type'
            element={<div>Select Practice Type Page</div>}
          />
          <Route
            path='/two-factor-auth'
            element={<div>2FA Page</div>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('<Login />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders fields and login button', () => {
    renderWithRouter();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('disables login button if fields are empty', () => {
    renderWithRouter();
    expect(screen.getByTestId('login-button')).toBeDisabled();
  });

  it('shows email validation error', async () => {
    renderWithRouter();
    fireEvent.change(screen.getByTestId('email'), { target: { value: 'invalid' } });
    fireEvent.blur(screen.getByTestId('email'));
  });

  it('shows password required validation error', async () => {
    renderWithRouter();
    fireEvent.blur(screen.getByTestId('password'));
  });

  it('calls login handler on valid form submit', async () => {
    const mockLogin = vi.fn();
    (useLoginHook.useUserLogin as unknown as Mock).mockReturnValue({
      isLoginLoading: false,
      postUserLogin: mockLogin,
      authCompletion: vi.fn(),
      selectUserPracticeAccount: vi.fn(),
    });

    renderWithRouter();

    fireEvent.change(screen.getByTestId('email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByTestId('login-button'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { emailId: 'user@example.com', password: 'Password123!' },
        expect.any(Function)
      );
    });
  });

  it('navigates to forgot password page', async () => {
    renderWithRouter();
    fireEvent.click(screen.getByTestId('forgot-password-link'));

    await waitFor(() => {
      expect(screen.getByText(/forgot password page/i)).toBeInTheDocument();
    });
  });

  it('navigates to create account page', async () => {
    renderWithRouter();
    fireEvent.click(screen.getByTestId('create-account-link'));

    await waitFor(() => {
      expect(screen.getByText(/welcome page/i)).toBeInTheDocument();
    });
  });

  it('navigates to reactivate account page', async () => {
    renderWithRouter();
    fireEvent.click(screen.getByTestId('reactivate-account-link'));

    await waitFor(() => {
      expect(screen.getByText(/welcome page/i)).toBeInTheDocument();
    });
  });
});
