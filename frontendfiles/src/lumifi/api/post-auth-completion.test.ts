import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { IPracticeAccountTypePayload, IUserResponse } from '../types/user-login-types';
import { axiosInstance } from './executer';
import { PostAuthCompletionApi } from './post-auth-completion';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

const mockPayload: IPracticeAccountTypePayload = {
  loginId: 'login123',
  userId: 'user123',
  practiceAccountId: 'practice123',
  emailId: 'test@example.com',
};

const mockResponse: IUserResponse = {
  message: 'Auth completed',
  status: 'success',
  authToken: 'token123',
  refreshToken: 'refresh123',
  exp: 1234567890,
  userDetails: {
    id: 'user123',
    readable_id: 'readable123',
    practice_account_id: 'practice123',
    first_name: 'John',
    last_name: 'Doe',
    email_id: 'test@example.com',
    phone_number: '1234567890',
    role_id: 'role1',
    role: 'admin',
    dea: 'dea123',
    license_number: 'lic123',
    state_of_issue: 'CA',
    password: 'hashedpassword',
    has_2fa: true,
    active_status: true,
    account_verified: true,
    created_by: null,
    updated_by: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: null,
    doctor_email_id: 'doctor@example.com',
  },
};

describe('PostAuthCompletionApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.post with correct URL and payload, and return response', async () => {
    (axiosInstance.post as unknown as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PostAuthCompletionApi(mockPayload);
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/completion', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axiosInstance.post fails', async () => {
    (axiosInstance.post as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(PostAuthCompletionApi(mockPayload)).rejects.toThrow('Network error');
  });
});
