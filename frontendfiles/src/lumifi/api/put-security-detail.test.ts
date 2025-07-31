import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { ISecurityUpdateRequest, ISecurityUpdateResponse } from '../types';
import { axiosInstance } from './executer';
import { PutSecurityDetailApi } from './put-security-detail';

vi.mock('./executer', () => ({
  axiosInstance: {
    put: vi.fn(),
  },
}));

const mockPayload: ISecurityUpdateRequest = {
  emailId: 'user@example.com',
  phoneNumber: '1234567890',
};

const mockResponse: ISecurityUpdateResponse = {
  message: 'Security details updated',
  status: 'success',
};

describe('PutSecurityDetailApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.put with correct URL and payload, and return response', async () => {
    (axiosInstance.put as unknown as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PutSecurityDetailApi(mockPayload);
    expect(axiosInstance.put).toHaveBeenCalledWith('/security/update', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axiosInstance.put fails', async () => {
    (axiosInstance.put as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(PutSecurityDetailApi(mockPayload)).rejects.toThrow('Network error');
  });
});
