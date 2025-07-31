import { describe, expect, it, vi, type Mock } from 'vitest';
import { DeleteUserApi } from './delete-user';
import { axiosInstance } from './executer';

vi.mock('./executer', () => ({
  axiosInstance: {
    delete: vi.fn(),
  },
}));

describe('DeleteUserApi', () => {
  const userId = 'test-user-id';
  const API_ENDPOINT = '/user/delete';

  it('should call axiosInstance.delete with correct URL', async () => {
    (axiosInstance.delete as unknown as Mock).mockResolvedValueOnce({ message: 'User deleted', status: 'success' });
    await DeleteUserApi(userId);
    expect(axiosInstance.delete).toHaveBeenCalledWith(`${API_ENDPOINT}?userId=${userId}`);
  });

  it('should return response as IDeleteUserRes on success', async () => {
    const mockRes = { message: 'User deleted', status: 'success' };
    (axiosInstance.delete as unknown as Mock).mockResolvedValueOnce(mockRes);
    const result = await DeleteUserApi(userId);
    expect(result).toEqual(mockRes);
  });

  it('should throw an error on failure', async () => {
    (axiosInstance.delete as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));
    await expect(DeleteUserApi(userId)).rejects.toThrow('Network error');
  });
});
