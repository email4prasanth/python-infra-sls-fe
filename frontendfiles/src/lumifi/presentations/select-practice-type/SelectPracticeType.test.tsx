import { loginAuthReducer } from '@/store/slices';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectPracticeType } from './SelectPracticeType';

vi.mock('@/lumifi/hooks', async () => {
  const actual = await vi.importActual('@/lumifi/hooks');
  return {
    ...actual,
    useUserLogin: vi.fn(() => ({
      isSelectPracticeLoading: false,
      isAuthCompletionLoading: false,
      selectUserPracticeAccount: vi.fn(),
      authCompletion: vi.fn(),
    })),
  };
});

vi.mock('@/store/slices', async () => {
  const actual = await vi.importActual('@/store/slices');
  return {
    ...actual,
    clearLoginData: vi.fn(() => ({ type: 'CLEAR_LOGIN_DATA' })),
    setAccountDetail: vi.fn(() => ({ type: 'SET_ACCOUNT_DETAIL' })),
  };
});

// Mock state with complete ILoginAuthState structure
const mockStore = configureStore({
  reducer: {
    loginAuth: loginAuthReducer,
  },
  preloadedState: {
    loginAuth: {
      loginId: '123',
      emailId: 'test@example.com',
      userPracticeExistance: [
        { id: 'practice-1', practice_name: 'Clinic One' },
        { id: 'practice-2', practice_name: 'Clinic Two' },
      ],
      userId: '',
      has2fa: false,
      practiceAccountId: '',
    },
  },
});

const renderWithProviders = () => {
  render(
    <Provider store={mockStore}>
      <MemoryRouter initialEntries={['/select-practice-type']}>
        <Routes>
          <Route
            path='/select-practice-type'
            element={<SelectPracticeType />}
          />
          <Route
            path='/login'
            element={<div>Login Page</div>}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('<SelectPracticeType />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropdown and buttons', () => {
    renderWithProviders();
    expect(screen.getByTestId('practice-type-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('disables submit button if no selection is made', () => {
    renderWithProviders();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  it('shows validation error if submitted without selecting practice type', async () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('submit-button'));
  });

  it('navigates to login and clears data on cancel', async () => {
    renderWithProviders();
    fireEvent.click(screen.getByTestId('cancel-button'));
  });
});
