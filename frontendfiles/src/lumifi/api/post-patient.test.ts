import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { GetPatientPayload, IPatient } from '../types/patient.type';
import { axiosInstance } from './executer';
import { PostPatientApi } from './post-patient';

vi.mock('./executer', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

const mockPayload: GetPatientPayload = {
  firstName: 'Alice',
  lastName: 'Smith',
  dob: '1985-05-05',
};

const mockPatients: IPatient[] = [
  {
    id: '1',
    readable_id: 'P001',
    first_name: 'Alice',
    last_name: 'Smith',
    dob: '1985-05-05',
    email_id: 'alice@example.com',
    phone_number: '5551234567',
    active_status: true,
    implants: [],
  },
];

describe('PostPatientApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call axiosInstance.post with correct URL and payload, and return patients array', async () => {
    (axiosInstance.post as unknown as Mock).mockResolvedValueOnce(mockPatients);

    const result = await PostPatientApi(mockPayload);
    expect(axiosInstance.post).toHaveBeenCalledWith('/patient/search', mockPayload);
    expect(result).toEqual(mockPatients);
  });

  it('should throw an error if axiosInstance.post fails', async () => {
    (axiosInstance.post as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(PostPatientApi(mockPayload)).rejects.toThrow('Network error');
  });
});
