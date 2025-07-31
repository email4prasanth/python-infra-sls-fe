import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { ICreatePatientPayload, ICreatePatientResponse } from '../types/patient.type';
import { axiosInstance } from './executer';
import { PostCreatePatientsApi } from './post-create-patient';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

const mockPayload: ICreatePatientPayload = {
  firstName: 'Jane',
  lastName: 'Doe',
  dob: '1992-02-02',
  emailId: 'jane@example.com',
  phoneNumber: '9876543210',
};

const mockResponse: ICreatePatientResponse = {
  message: 'Patient created successfully',
  status: 'success',
};

describe('PostCreatePatientsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.post with correct URL and payload, and return response', async () => {
    (axiosInstance.post as unknown as Mock).mockResolvedValueOnce(mockResponse);

    const result = await PostCreatePatientsApi(mockPayload);
    expect(axiosInstance.post).toHaveBeenCalledWith('/patient/create', mockPayload);
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error if axiosInstance.post fails', async () => {
    (axiosInstance.post as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(PostCreatePatientsApi(mockPayload)).rejects.toThrow('Network error');
  });
});
