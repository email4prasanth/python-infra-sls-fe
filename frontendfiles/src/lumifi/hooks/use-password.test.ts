import { act, renderHook } from '@testing-library/react';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GetResetPasswordLinkApi, PostResetPasswordApi, PostSetPasswordApi } from '../api';
import { usePassword } from './use-password';

// Mock APIs and toast
vi.mock('../api', () => ({
  PostSetPasswordApi: vi.fn(),
  GetResetPasswordLinkApi: vi.fn(),
  PostResetPasswordApi: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Silence console errors in test output
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('usePassword hook', () => {
  const mockSuccessResponse = { message: 'Success', status: 'success' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle setPassword success', async () => {
    (PostSetPasswordApi as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSuccessResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => usePassword());

    await act(async () => {
      await result.current.setPassword({ credential: 'token', password: 'Password123!' }, onComplete);
    });

    expect(PostSetPasswordApi).toHaveBeenCalledWith({ credential: 'token', password: 'Password123!' });
    expect(toast.success).toHaveBeenCalledWith('Success');
    expect(onComplete).toHaveBeenCalledWith('success');
    expect(result.current.isSettingPassword).toBe(false);
  });

  it('should handle setPassword failure', async () => {
    (PostSetPasswordApi as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Error'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => usePassword());

    await act(async () => {
      await result.current.setPassword({ credential: 'token', password: 'Password123!' }, onComplete);
    });

    expect(console.error).toHaveBeenCalledWith('Error Creating Patient: ', expect.any(Error));
    expect(onComplete).toHaveBeenCalledWith('Failure');
    expect(result.current.isSettingPassword).toBe(false);
  });

  it('should handle sendResetPasswordLink success', async () => {
    (GetResetPasswordLinkApi as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSuccessResponse);

    const { result } = renderHook(() => usePassword());

    await act(async () => {
      await result.current.sendResetPasswordLink('user@example.com');
    });

    expect(GetResetPasswordLinkApi).toHaveBeenCalledWith('user@example.com');
    expect(toast.success).toHaveBeenCalledWith('Success');
    expect(result.current.isSendingResetLink).toBe(false);
  });

  it('should handle sendResetPasswordLink failure', async () => {
    (GetResetPasswordLinkApi as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Error'));

    const { result } = renderHook(() => usePassword());

    await act(async () => {
      await result.current.sendResetPasswordLink('user@example.com');
    });

    expect(console.error).toHaveBeenCalledWith('Error Sending Reset Password Link: ', expect.any(Error));
    expect(result.current.isSendingResetLink).toBe(false);
  });

  it('should handle resetPassword success', async () => {
    (PostResetPasswordApi as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSuccessResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => usePassword());

    await act(async () => {
      await result.current.resetPassword({ credential: 'reset-token', password: 'NewPass123!' }, onComplete);
    });

    expect(PostResetPasswordApi).toHaveBeenCalledWith({ credential: 'reset-token', password: 'NewPass123!' });
    expect(toast.success).toHaveBeenCalledWith('Success');
    expect(onComplete).toHaveBeenCalledWith('success');
    expect(result.current.isResettingPassword).toBe(false);
  });

  it('should handle resetPassword failure', async () => {
    (PostResetPasswordApi as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Error'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => usePassword());

    await act(async () => {
      await result.current.resetPassword({ credential: 'reset-token', password: 'NewPass123!' }, onComplete);
    });

    expect(console.error).toHaveBeenCalledWith('Error Resetting Password: ', expect.any(Error));
    expect(onComplete).toHaveBeenCalledWith('Failure');
    expect(result.current.isResettingPassword).toBe(false);
  });
});
