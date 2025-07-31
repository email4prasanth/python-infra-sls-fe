import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { IUpdatePatientPayload, IUpdatePatientResponse } from '../types/patient.type';
import { axiosInstance } from './executer';
import { PutPatientApi } from './put-patient';

vi.mock('./executer', () => ({
  axiosInstance: {
    put: vi.fn(),
  },
}));

const mockPayload: IUpdatePatientPayload = {
  id: '1',
  firstName: 'Bob',
  lastName: 'Brown',
  dob: '1980-08-08',
  emailId: 'bob@example.com',
  phoneNumber: '5559876543',
};

const mockResponse: IUpdatePatientResponse = {
  message: 'Patient updated successfully',
  status: 'success',
};

describe('PutPatientApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.put with correct URL and payload, and return response', async () => {
    (axiosInstance.put as unknown as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PutPatientApi(mockPayload);
    expect(axiosInstance.put).toHaveBeenCalledWith('/patient/update', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axiosInstance.put fails', async () => {
    (axiosInstance.put as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(PutPatientApi(mockPayload)).rejects.toThrow('Network error');
  });
});
