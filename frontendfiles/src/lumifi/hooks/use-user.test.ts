import { setLoginData, setUser } from '@/store/slices';
import { act, renderHook } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { PostAuthCompletionApi, PostLoginApi, PostUserPracticeAccountApi } from '../api';
import { PostResendOtpApi } from '../api/post-resend-otp';
import { PostVerifyOtpApi } from '../api/post-verify-otp';
import type {
  ILoginResponse,
  ILoginUser,
  IPracticeAccountTypePayload,
  IResendOtp,
  ISelectUserPracticeRequest,
  ITwoFaResponse,
  IUserPracticeTypeResponse,
  IUserResponse,
  IVerifyOtp,
} from '../types/user-login-types';
import { useUserLogin } from './use-user';

// Mock Redux and toast
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));
vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Mock API modules
vi.mock('../api', () => ({
  PostLoginApi: vi.fn(),
  PostUserPracticeAccountApi: vi.fn(),
  PostAuthCompletionApi: vi.fn(),
}));
vi.mock('../api/post-resend-otp', () => ({
  PostResendOtpApi: vi.fn(),
}));
vi.mock('../api/post-verify-otp', () => ({
  PostVerifyOtpApi: vi.fn(),
}));

describe('useUserLogin', () => {
  const dispatchMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useDispatch as unknown as Mock).mockReturnValue(dispatchMock);
  });

  // Test: User Login
  it('logs in user successfully', async () => {
    const mockResponse: ILoginResponse = {
      message: 'Login successful',
      loginId: 'login-123',
      emailId: 'test@example.com',
      practiceAccountList: [],
      status: 'success',
    };
    (PostLoginApi as Mock).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.postUserLogin({} as ILoginUser, onComplete);
    });

    expect(result.current.loginResponse).toEqual(mockResponse);
    expect(toast.success).toHaveBeenCalledWith('Login successful');
    expect(dispatchMock).toHaveBeenCalledWith(
      setLoginData({
        loginId: 'login-123',
        emailId: 'test@example.com',
        userPracticeExistance: [],
      })
    );
    expect(onComplete).toHaveBeenCalledWith({ status: 'success', response: mockResponse });
    expect(result.current.isLoginLoading).toBe(false);
  });

  it('handles login error', async () => {
    (PostLoginApi as Mock).mockRejectedValueOnce(new Error('Authentication failed'));
    const onComplete = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.postUserLogin({} as ILoginUser, onComplete);
    });

    expect(onComplete).toHaveBeenCalledWith({ status: 'failure', response: null });
    expect(result.current.isLoginLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  // Test: OTP Verification
  it('verifies OTP successfully', async () => {
    const mockResponse: ITwoFaResponse = {
      message: 'OTP verified',
      status: 'success',
    };
    (PostVerifyOtpApi as Mock).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.VerifyOtp({} as IVerifyOtp, onComplete);
    });

    expect(result.current.twoFaResponse).toEqual(mockResponse);
    expect(toast.success).toHaveBeenCalledWith('OTP verified');
    expect(onComplete).toHaveBeenCalledWith('success');
    expect(result.current.isTwoFaLoading).toBe(false);
  });

  it('handles OTP verification error', async () => {
    (PostVerifyOtpApi as Mock).mockRejectedValueOnce(new Error('Invalid OTP'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.VerifyOtp({} as IVerifyOtp, onComplete);
    });

    expect(result.current.isTwoFaLoading).toBe(false);
    expect(onComplete).toHaveBeenCalledWith('failure');
  });

  // Test: Resend OTP
  // Test: Resend OTP
  it('resends OTP successfully', async () => {
    const mockResponse: ITwoFaResponse = {
      message: 'OTP resent',
      status: 'success',
    };
    (PostResendOtpApi as Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.resendOtp({} as IResendOtp);
    });

    expect(result.current.twoFaResponse).toEqual(mockResponse);
    expect(toast.success).toHaveBeenCalledWith('OTP resent'); // Changed from 'OTP resent successfully'
    expect(result.current.isResendOtpLoading).toBe(false);
  });

  it('handles resend OTP error', async () => {
    (PostResendOtpApi as Mock).mockRejectedValueOnce(new Error('Resend failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.resendOtp({} as IResendOtp);
    });

    expect(result.current.isResendOtpLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Two-factor authentication failed:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  // Test: Select Practice Account
  it('selects user practice account successfully', async () => {
    const mockResponse: IUserPracticeTypeResponse = {
      message: 'Practice selected',
      status: 'success',
      loginId: '',
      userId: '',
      emailId: '',
      has2fa: false,
      otp: '',
    };
    const practiceRequest: ISelectUserPracticeRequest = {
      loginId: 'login-123',
      practiceAccountId: 'practice-456',
      emailId: '',
    };
    (PostUserPracticeAccountApi as Mock).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.selectUserPracticeAccount(practiceRequest, onComplete);
    });

    expect(onComplete).toHaveBeenCalledWith({
      status: 'success',
      response: mockResponse,
      practiceAccountId: 'practice-456',
    });
    expect(result.current.isSelectPracticeLoading).toBe(false);
  });

  it('handles practice account selection error', async () => {
    (PostUserPracticeAccountApi as Mock).mockRejectedValueOnce(new Error('Selection failed'));
    const onComplete = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.selectUserPracticeAccount({} as ISelectUserPracticeRequest, onComplete);
    });

    expect(onComplete).toHaveBeenCalledWith({ status: 'failure', response: null, practiceAccountId: null });
    expect(result.current.isSelectPracticeLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to update user practice type:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  // Test: Auth Completion
  it('completes auth successfully', async () => {
    const mockResponse: IUserResponse = {
      message: 'Login Successful',
      status: 'success',
      authToken: 'token-123',
      refreshToken: 'refresh-456',
      userDetails: {
        id: 'user-123',
        readable_id: 'user-123',
        practice_account_id: 'practice-456',
        first_name: 'Test',
        last_name: 'User',
        email_id: 'test@example.com',
        phone_number: '1234567890',
        role_id: 'role-123',
        role: 'doctor',
        dea: 'DEA123',
        license_number: 'LIC456',
        state_of_issue: 'CA',
        password: 'hashed-password',
        has_2fa: true,
        active_status: true,
        account_verified: true,
        created_by: null,
        updated_by: null,
        created_at: '2023-01-01',
        updated_at: null,
        doctor_email_id: 'doctor@example.com',
      },
    };
    (PostAuthCompletionApi as Mock).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.authCompletion({} as IPracticeAccountTypePayload, onComplete);
    });

    expect(dispatchMock).toHaveBeenCalledWith(setUser(mockResponse));
    expect(toast.success).toHaveBeenCalledWith('Login Successful');
    expect(onComplete).toHaveBeenCalledWith({ status: 'success', userData: mockResponse });
    expect(result.current.isAuthCompletionLoading).toBe(false);
  });
  it('handles auth completion error', async () => {
    (PostAuthCompletionApi as Mock).mockRejectedValueOnce(new Error('Auth failed'));
    const onComplete = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUserLogin());
    await act(async () => {
      result.current.authCompletion({} as IPracticeAccountTypePayload, onComplete);
    });

    expect(result.current.isAuthCompletionLoading).toBe(false);
    expect(onComplete).toHaveBeenCalledWith({ status: 'failure' });
    expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user login data:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
