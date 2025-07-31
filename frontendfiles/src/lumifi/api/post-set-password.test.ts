import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { ISetPasswordPayload, ISetPasswordResponse } from '../types';
import { axiosInstance } from './executer';
import { PostSetPasswordApi } from './post-set-password';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

const mockPayload: ISetPasswordPayload = {
  credential: 'token-abc',
  password: 'SuperSecret123!',
};

const mockResponse: ISetPasswordResponse = {
  message: 'Password set successfully',
  status: 'success',
};

describe('PostSetPasswordApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.post with correct URL and payload, and return response', async () => {
    (axiosInstance.post as unknown as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PostSetPasswordApi(mockPayload);
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/setPassword', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axiosInstance.post fails', async () => {
    (axiosInstance.post as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(PostSetPasswordApi(mockPayload)).rejects.toThrow('Network error');
  });
});
