import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from 'react-toastify';
import { GetPatientApi, PostCreatePatientsApi, PostPatientApi, PutPatientApi } from '../api';
import { usePatient } from './use-patients';

// Mock APIs and toast
vi.mock('../api', () => ({
  PostPatientApi: vi.fn(),
  GetPatientApi: vi.fn(),
  PostCreatePatientsApi: vi.fn(),
  PutPatientApi: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Suppress console errors in tests
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('usePatient hook', () => {
  const mockPatients = [
    {
      id: '1',
      readable_id: 'P001',
      first_name: 'John',
      last_name: 'Doe',
      dob: '1990-01-01',
      email_id: 'john@example.com',
      phone_number: '1234567890',
      active_status: true,
      implants: [],
    },
  ];

  const mockPatientDetail = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1990-01-01',
    emailId: 'john@example.com',
    phoneNumber: '1234567890',
  };

  const mockSuccessResponse = { message: 'Operation Successful', status: 'success' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch patient info', async () => {
    (PostPatientApi as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockPatients);

    const { result } = renderHook(() => usePatient());

    await act(async () => {
      await result.current.fetchPatientInfo({
        firstName: 'John',
        lastName: 'Doe',
        dob: '1990-01-01',
      });
    });

    expect(PostPatientApi).toHaveBeenCalled();
    expect(result.current.patientInfo).toEqual(mockPatients);
    expect(result.current.isPatientFetching).toBe(false);
  });

  it('should reset patient info', () => {
    const { result } = renderHook(() => usePatient());

    act(() => {
      result.current.resetPatientInfo();
    });

    expect(result.current.patientInfo).toEqual([]);
  });

  it('should fetch patient details', async () => {
    (GetPatientApi as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockPatientDetail);

    const { result } = renderHook(() => usePatient());

    await act(async () => {
      await result.current.fetchPatientDetails('1');
    });

    expect(GetPatientApi).toHaveBeenCalledWith('1');
    expect(result.current.patientDetails).toEqual(mockPatientDetail);
    expect(result.current.isPatientInfoFetching).toBe(false);
  });

  it('should create a patient and call onComplete', async () => {
    (PostCreatePatientsApi as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSuccessResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => usePatient());

    await act(async () => {
      await result.current.createPatient(
        {
          firstName: 'Jane',
          lastName: 'Smith',
          dob: '1995-05-15',
          emailId: 'jane@example.com',
          phoneNumber: '9876543210',
        },
        onComplete
      );
    });

    expect(PostCreatePatientsApi).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Operation Successful');
    expect(onComplete).toHaveBeenCalled();
    expect(result.current.isPatientCreating).toBe(false);
  });

  it('should update a patient and call onComplete', async () => {
    (PutPatientApi as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockSuccessResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => usePatient());

    await act(async () => {
      await result.current.updatePatient(
        {
          id: '1',
          firstName: 'Updated',
          lastName: 'Patient',
          dob: '1991-02-02',
          emailId: 'updated@example.com',
          phoneNumber: '9999999999',
        },
        onComplete
      );
    });

    expect(PutPatientApi).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Operation Successful');
    expect(onComplete).toHaveBeenCalled();
    expect(result.current.isUpdatingPatient).toBe(false);
  });
});
