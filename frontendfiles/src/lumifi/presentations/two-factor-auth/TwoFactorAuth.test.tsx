import { useUserLogin } from '@/lumifi/hooks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { TwoFactorAuthForm } from './TwoFactorAuth';

// Mock hooks and dependencies
vi.mock('@/lumifi/hooks', () => ({
  useUserLogin: vi.fn(),
}));

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  t: vi.fn((_ns, key) => {
    // Return actual text for better test assertions
    if (key === 'twoFactorAuth.title') return 'Two-Factor Authentication';
    if (key === 'twoFactorAuth.subtitle') return 'Verification code sent to';
    if (key === 'twoFactorAuth.code.label') return 'Verification Code';
    if (key === 'common.resend') return 'Resend';
    if (key === 'common.login') return 'Login';
    return key;
  }),
}));

vi.mock('@/lib/ui/components/loader', () => ({
  ButtonLoader: () => <div data-testid='button-loader'>Loading...</div>,
}));

describe('TwoFactorAuthForm', () => {
  const mockVerifyOtp = vi.fn();
  const mockResendOtp = vi.fn();
  const mockAuthCompletion = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock useSelector
    (useSelector as unknown as Mock).mockImplementation((selector) => {
      if (selector) {
        return {
          loginId: 'test-login-id',
          emailId: 'test@example.com',
          practiceAccountId: 'test-practice-id',
          userId: 'test-user-id',
        };
      }
      return {};
    });

    // Mock useUserLogin
    (useUserLogin as unknown as Mock).mockReturnValue({
      isTwoFaLoading: false,
      VerifyOtp: mockVerifyOtp,
      isResendOtpLoading: false,
      resendOtp: mockResendOtp,
      isAuthCompletionLoading: false,
      authCompletion: mockAuthCompletion,
    });

    // Mock useNavigate
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
  });

  it('renders correctly with initial state', () => {
    render(<TwoFactorAuthForm />);

    // Verify title and subtitle
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
    expect(screen.getByText(/Verification code sent to/)).toBeInTheDocument();

    // Verify form elements
    expect(screen.getByTestId('2fa-form')).toBeInTheDocument();
    expect(screen.getByTestId('resend-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  it('enables submit button when code is entered', async () => {
    render(
      <Formik
        initialValues={{ code: '' }}
        onSubmit={vi.fn()}
      >
        {({ values, handleChange }) => (
          <input
            data-testid='2fa-code-input'
            name='code'
            value={values.code}
            onChange={handleChange}
          />
        )}
      </Formik>
    );

    const codeInput = screen.getByTestId('2fa-code-input');
    fireEvent.change(codeInput, { target: { value: '123456' } });

    await waitFor(() => {
      expect(codeInput).toHaveValue('123456');
    });
  });

  it('calls VerifyOtp with correct payload when form is submitted', async () => {
    mockVerifyOtp.mockImplementation((_payload, callback) => {
      callback('success');
    });

    render(<TwoFactorAuthForm />);

    // Enter code and submit
    const codeInput = screen.getByTestId('2fa-code-input');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockVerifyOtp).toHaveBeenCalledWith(
        {
          loginId: 'test-login-id',
          emailId: 'test@example.com',
          otp: '123456',
        },
        expect.any(Function)
      );
    });
  });

  it('calls authCompletion after successful OTP verification', async () => {
    mockVerifyOtp.mockImplementation((_payload, callback) => {
      callback('success');
    });

    render(<TwoFactorAuthForm />);

    // Enter code and submit
    const codeInput = screen.getByTestId('2fa-code-input');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockAuthCompletion).toHaveBeenCalledWith(
        {
          loginId: 'test-login-id',
          emailId: 'test@example.com',
          practiceAccountId: 'test-practice-id',
          userId: 'test-user-id',
        },
        expect.any(Function)
      );
    });
  });

  it('navigates to home on successful auth completion', async () => {
    mockVerifyOtp.mockImplementation((_payload, callback) => {
      callback('success');
    });

    mockAuthCompletion.mockImplementation((_payload, callback) => {
      callback({
        status: 'success',
        userData: {
          status: 'success',
          message: 'Login successful',
        },
      });
    });

    render(<TwoFactorAuthForm />);

    // Enter code and submit
    const codeInput = screen.getByTestId('2fa-code-input');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('navigates to verification pending page when account not verified', async () => {
    mockVerifyOtp.mockImplementation((_payload, callback) => {
      callback('success');
    });

    mockAuthCompletion.mockImplementation((_payload, callback) => {
      callback({
        status: 'success',
        userData: {
          status: 'failure',
          message: 'Your practice account is not verified',
        },
      });
    });

    render(<TwoFactorAuthForm />);

    // Enter code and submit
    const codeInput = screen.getByTestId('2fa-code-input');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verification-pending/PA');
    });
  });

  it('calls resendOtp with correct payload when resend button is clicked', async () => {
    render(<TwoFactorAuthForm />);

    fireEvent.click(screen.getByTestId('resend-button'));

    await waitFor(() => {
      expect(mockResendOtp).toHaveBeenCalledWith({
        loginId: 'test-login-id',
        emailId: 'test@example.com',
      });
    });
  });

  it('shows loader when isTwoFaLoading is true', () => {
    (useUserLogin as unknown as Mock).mockReturnValue({
      isTwoFaLoading: true,
      VerifyOtp: mockVerifyOtp,
      isResendOtpLoading: false,
      resendOtp: mockResendOtp,
      isAuthCompletionLoading: false,
      authCompletion: mockAuthCompletion,
    });

    render(<TwoFactorAuthForm />);

    expect(screen.getByTestId('submit-button')).toContainElement(screen.getByTestId('button-loader'));
  });

  it('shows loader when isResendOtpLoading is true', () => {
    (useUserLogin as unknown as Mock).mockReturnValue({
      isTwoFaLoading: false,
      VerifyOtp: mockVerifyOtp,
      isResendOtpLoading: true,
      resendOtp: mockResendOtp,
      isAuthCompletionLoading: false,
      authCompletion: mockAuthCompletion,
    });

    render(<TwoFactorAuthForm />);

    expect(screen.getByTestId('resend-button')).toContainElement(screen.getByTestId('button-loader'));
  });
});
