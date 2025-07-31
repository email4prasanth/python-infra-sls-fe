import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { IResetPasswordResponse } from '../types';
import { axiosInstance } from './executer';
import { GetResetPasswordLinkApi } from './get-reset-password';

vi.mock('./executer', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockResponse: IResetPasswordResponse = {
  message: 'Reset link sent',
  status: 'success',
};

describe('GetResetPasswordLinkApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.get with correct URL and return response', async () => {
    (axiosInstance.get as unknown as Mock).mockResolvedValueOnce(mockResponse);

    const result = await GetResetPasswordLinkApi('test@example.com');
    expect(axiosInstance.get).toHaveBeenCalledWith('/auth/forgotPassword?emailId=test@example.com');
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axiosInstance.get fails', async () => {
    (axiosInstance.get as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(GetResetPasswordLinkApi('test@example.com')).rejects.toThrow('Network error');
  });
});
