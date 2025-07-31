import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { IGetPatientResponse } from '../types/patient.type';
import { axiosInstance } from './executer';
import { GetPatientApi } from './get-patient';

vi.mock('./executer', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockPatient: IGetPatientResponse = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  dob: '1990-01-01',
  emailId: 'john@example.com',
  phoneNumber: '1234567890',
};

describe('GetPatientApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.get with correct URL and return patient data', async () => {
    (axiosInstance.get as unknown as Mock).mockResolvedValueOnce(mockPatient);

    const result = await GetPatientApi('1');
    expect(axiosInstance.get).toHaveBeenCalledWith('/patient/detail?id=1');
    expect(result).toEqual(mockPatient);
  });

  it('should throw an error if axiosInstance.get fails', async () => {
    (axiosInstance.get as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(GetPatientApi('1')).rejects.toThrow('Network error');
  });
});
