import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { axiosInstance } from './executer';
import { GetPracticeInfoApi } from './get-practice-info';

vi.mock('./executer', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const practiceId = 'practice-123';
const API_ENDPOINT = '/practice';

const mockPracticeInfo = {
  id: 'practice-123',
  readable_id: 'readable-123',
  practice_name: 'Test Practice',
  address1: '123 Main St',
  address2: '',
  city: 'Test City',
  state: 'TS',
  zip: '12345',
  office_email: 'test@practice.com',
  office_phone: '123-456-7890',
  website_address: 'https://testpractice.com',
  speciality_id: 'spec-1',
  speciality_name: 'Speciality',
  practice_software_id: 'soft-1',
  practice_software_name: 'Software',
  has_accepted_terms: true,
  active_status: true,
  account_verified: true,
  country_id: 'country-1',
  country: 'Country',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: null,
  created_by: null,
  updated_by: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GetPracticeInfoApi', () => {
  it('should call axiosInstance.get with correct URL', async () => {
    (axiosInstance.get as unknown as Mock).mockResolvedValueOnce(mockPracticeInfo);
    await GetPracticeInfoApi(practiceId);
    expect(axiosInstance.get).toHaveBeenCalledWith(`${API_ENDPOINT}?id=${practiceId}`);
  });

  it('should return response as IGetPracticeInfo on success', async () => {
    (axiosInstance.get as unknown as Mock).mockResolvedValueOnce(mockPracticeInfo);
    const result = await GetPracticeInfoApi(practiceId);
    expect(result).toEqual(mockPracticeInfo);
  });

  it('should throw an error on failure', async () => {
    (axiosInstance.get as unknown as Mock).mockRejectedValueOnce(new Error('Network error'));
    await expect(GetPracticeInfoApi(practiceId)).rejects.toThrow('Network error');
  });
});
