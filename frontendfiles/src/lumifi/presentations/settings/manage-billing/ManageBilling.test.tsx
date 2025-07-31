import { meReducer } from '@/store/slices/me';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ManageBilling } from './ManageBilling';

vi.mock('@/lib/utils', () => ({
  t: (_ns: string, key: string) => key,
}));

vi.stubEnv('VITE_STRIPE_DASHBOARD_URL', 'https://dashboard.stripe.com');

const renderWithRole = (role: string) => {
  const store = configureStore({
    reducer: {
      me: meReducer,
    },
    preloadedState: {
      me: {
        details: {
          id: 'u1',
          readable_id: 'U001',
          practice_account_id: 'pa1',
          email_id: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '1234567890',
          role_id: 'r1',
          role,
          dea: '',
          license_number: '',
          state_of_issue: '',
          password: '',
          has_2fa: false,
          active_status: true,
          account_verified: true,
          created_by: null,
          updated_by: null,
          created_at: '2024-01-01',
          updated_at: null,
          doctor_email_id: 'john@clinic.com',
        },
        isMeLoaded: true,
      },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ManageBilling />
      </MemoryRouter>
    </Provider>
  );
};

describe('<ManageBilling />', () => {
  it('renders header and titles', () => {
    renderWithRole('Admin');
    expect(screen.getByText('manageBilling.heading')).toBeInTheDocument();
    expect(screen.getByText('manageBilling.title1')).toBeInTheDocument();
    expect(screen.getByText('manageBilling.title2')).toBeInTheDocument();
  });

  it('enables Manage Billing button for Admin role', () => {
    renderWithRole('Admin');
    const button = screen.getByRole('button', { name: 'manageBilling.manageBillingBtn' });
    expect(button).toBeEnabled();
  });

  it('disables Manage Billing button for unauthorized role', () => {
    renderWithRole('Doctor');
    const button = screen.getByRole('button', { name: 'manageBilling.manageBillingBtn' });
    expect(button).toBeDisabled();
  });

  it('enables Manage Billing button for Account Owner role', () => {
    renderWithRole('Account Owner');
    const button = screen.getByRole('button', { name: 'manageBilling.manageBillingBtn' });
    expect(button).toBeEnabled();
  });
});
