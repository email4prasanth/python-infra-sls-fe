// tests/PracticeInfoDetail.test.tsx
import * as practiceHook from '@/lumifi/hooks';
import { meReducer } from '@/store/slices/me';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { PracticeInfoDetail } from './PracticeInfoDetail';

vi.mock('@/lumifi/hooks', async () => {
  const actual = await vi.importActual('@/lumifi/hooks');
  return {
    ...actual,
    usePracticeInfo: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderWithStore = (meState: any) => {
  const store = configureStore({
    reducer: { me: meReducer },
    preloadedState: { me: meState },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <PracticeInfoDetail />
      </MemoryRouter>
    </Provider>
  );
};

describe('<PracticeInfoDetail />', () => {
  const mockPractice = {
    practice_name: 'Bright Dental',
    address1: '123 Main St',
    address2: 'Suite 100',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    office_email: 'info@brightdental.com',
    office_phone: '123-456-7890',
    website_address: 'https://brightdental.com',
    speciality_name: 'Dentistry',
    practice_software_name: 'DentSoft',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader when fetching', () => {
    (practiceHook.usePracticeInfo as unknown as Mock).mockReturnValue({
      isPracticeInfoFetching: true,
      practiceInfo: null,
      getPracticeInfo: vi.fn(),
    });

    renderWithStore({
      details: {
        role: 'Account Owner',
        practice_account_id: 'pa-001',
        isMeLoaded: true,
      },
      isMeLoaded: true,
    });
  });

  it('renders no info when practiceInfo is null', () => {
    (practiceHook.usePracticeInfo as unknown as Mock).mockReturnValue({
      isPracticeInfoFetching: false,
      practiceInfo: null,
      getPracticeInfo: vi.fn(),
    });

    renderWithStore({
      details: { role: 'Account Owner', practice_account_id: 'pa-001' },
      isMeLoaded: true,
    });

    expect(screen.getByTestId('no-data-field')).toBeInTheDocument();
  });

  it('renders practice info details', async () => {
    (practiceHook.usePracticeInfo as unknown as Mock).mockReturnValue({
      isPracticeInfoFetching: false,
      practiceInfo: mockPractice,
      getPracticeInfo: vi.fn(),
    });

    renderWithStore({
      details: { role: 'Account Owner', practice_account_id: 'pa-001' },
      isMeLoaded: true,
    });
  });

  it('shows edit button for Account Owner and triggers navigation', async () => {
    (practiceHook.usePracticeInfo as unknown as Mock).mockReturnValue({
      isPracticeInfoFetching: false,
      practiceInfo: mockPractice,
      getPracticeInfo: vi.fn(),
    });

    renderWithStore({
      details: { role: 'Account Owner', practice_account_id: 'pa-001' },
      isMeLoaded: true,
    });

    const editBtn = screen.getByTestId('edit-button');
    expect(editBtn).toBeInTheDocument();

    fireEvent.click(editBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/settings/practice-info/edit', {
      state: { practiceInfo: mockPractice },
    });
  });

  it('does not show edit button for non-account owners', () => {
    (practiceHook.usePracticeInfo as unknown as Mock).mockReturnValue({
      isPracticeInfoFetching: false,
      practiceInfo: mockPractice,
      getPracticeInfo: vi.fn(),
    });

    renderWithStore({
      details: { role: 'Doctor', practice_account_id: 'pa-001' },
      isMeLoaded: true,
    });

    expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
  });
});
