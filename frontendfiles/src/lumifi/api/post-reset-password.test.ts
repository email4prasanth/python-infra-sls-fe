import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { IResetPasswordPayload, IResetPasswordResponse } from '../types';
import { axiosInstance } from './executer';
import { PostResetPasswordApi } from './post-reset-password';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

const mockPayload: IResetPasswordPayload = {
  credential: 'reset-token-123',
  password: 'newStrongPassword!',
};

const mockResponse: IResetPasswordResponse = {
  message: 'Password reset successful',
  status: 'success',
};

describe('PostResetPasswordApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.post with correct URL and payload, and return response', async () => {
    (axiosInstance.post as unknown as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PostResetPasswordApi(mockPayload);
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/resetPassword', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axiosInstance.post fails', async () => {
    (axiosInstance.post as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(PostResetPasswordApi(mockPayload)).rejects.toThrow('Network error');
  });
});
