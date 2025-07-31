import { act, renderHook } from '@testing-library/react';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import {
  DeleteUserApi,
  GetUserApi,
  GetUserRolesListApi,
  PostCreateUserApi,
  PostUserListApi,
  PutSecurityDetailApi,
  PutUserApi,
} from '../api';
import type {
  ICreateUserPayload,
  IGetUserRes,
  IGetUserRole,
  IPagination,
  ISecurityUpdateRequest,
  IUpdateUserPayload,
  IUser,
  IUserListRequest,
} from '../types';
import { useManageUser } from './use-manage-users';

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../api', () => ({
  DeleteUserApi: vi.fn(),
  GetUserApi: vi.fn(),
  GetUserRolesListApi: vi.fn(),
  PostCreateUserApi: vi.fn(),
  PostUserListApi: vi.fn(),
  PutSecurityDetailApi: vi.fn(),
  PutUserApi: vi.fn(),
}));

describe('useManageUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // User List Tests
  it('fetches user list successfully', async () => {
    const mockList: IUser[] = [
      {
        id: '1',
        role: 'Admin',
        // other required IUser fields
      } as IUser,
    ];
    const mockPagination: IPagination = {
      currentPage: 1,
      rowsPerPage: 10,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null,
    };
    (PostUserListApi as Mock).mockResolvedValueOnce({
      list: mockList,
      pagination: mockPagination,
    });

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.getUserList({} as IUserListRequest);
    });

    expect(result.current.userList).toEqual(
      mockList.map((user) => ({
        ...user,
        hasActionMenu: user.role === 'Account Owner' ? false : true,
      }))
    );
    expect(result.current.userPagination).toEqual(mockPagination);
    expect(result.current.isUserListFetching).toBe(false);
  });

  // it('handles error in fetching user list', async () => {
  //   (PostUserListApi as Mock).mockRejectedValueOnce(new Error('Failed'));
  //   const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  //   const { result } = renderHook(() => useManageUser());
  //   await act(async () => {
  //     result.current.getUserList({} as IUserListRequest);
  //   });

  //   expect(result.current.isUserListFetching).toBe(false);
  //   expect(consoleSpy).toHaveBeenCalled();
  //   consoleSpy.mockRestore();
  // });

  // User Details Tests
  it('fetches user details successfully', async () => {
    const mockUser: IGetUserRes = {
      id: '1',
      // other required IGetUserRes fields
    } as IGetUserRes;
    (GetUserApi as Mock).mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.fetchUserDetails('1');
    });

    expect(result.current.userDetails).toEqual(mockUser);
    expect(result.current.isUserFetching).toBe(false);
  });

  it('handles error in fetching user details', async () => {
    (GetUserApi as Mock).mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.fetchUserDetails('1');
    });

    expect(result.current.isUserFetching).toBe(false);
  });

  // Create User Tests
  it('creates user successfully', async () => {
    const mockResponse = { message: 'User created successfully' };
    (PostCreateUserApi as Mock).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.createUser({} as ICreateUserPayload, onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('User created successfully');
    expect(result.current.isUserCreating).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });

  it('handles error in creating user', async () => {
    (PostCreateUserApi as Mock).mockRejectedValueOnce(new Error('Failed'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.createUser({} as ICreateUserPayload, onComplete);
    });

    expect(result.current.isUserCreating).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  // Update User Tests
  it('updates user successfully', async () => {
    const mockResponse = { message: 'User updated successfully' };
    (PutUserApi as Mock).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.updateUser({} as IUpdateUserPayload, onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('User updated successfully');
    expect(result.current.isUserUpdating).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });

  it('handles error in updating user', async () => {
    (PutUserApi as Mock).mockRejectedValueOnce(new Error('Failed'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.updateUser({} as IUpdateUserPayload, onComplete);
    });

    expect(result.current.isUserUpdating).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  // Delete User Tests
  it('deletes user successfully', async () => {
    const mockResponse = { message: 'User deleted successfully' };
    (DeleteUserApi as Mock).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.deleteUser('1', onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('User deleted successfully');
    expect(result.current.isUserDeleting).toBe(false);
    expect(onComplete).toHaveBeenCalledWith('success');
  });

  it('handles error in deleting user', async () => {
    (DeleteUserApi as Mock).mockRejectedValueOnce(new Error('Failed'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.deleteUser('1', onComplete);
    });

    expect(result.current.isUserDeleting).toBe(false);
    expect(onComplete).not.toHaveBeenCalled();
  });

  // User Dependencies Tests
  it('fetches user dependencies successfully', async () => {
    const mockRoles: IGetUserRole[] = [
      { id: 1, role_name: 'Admin' },
      { id: 2, role_name: 'Account Owner' },
    ] as unknown as IGetUserRole[];
    (GetUserRolesListApi as Mock).mockResolvedValueOnce(mockRoles);

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.fetchUserDependencies();
    });

    expect(result.current.availableRolesForUser).toEqual([{ id: 1, role_name: 'Admin' }]);
    expect(result.current.isUserDependenciesLoading).toBe(false);
  });

  it('handles error in fetching user dependencies', async () => {
    (GetUserRolesListApi as Mock).mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.fetchUserDependencies();
    });

    expect(result.current.isUserDependenciesLoading).toBe(false);
  });

  // Security Update Tests
  it('updates security details successfully', async () => {
    const mockResponse = { message: 'Security updated successfully' };
    (PutSecurityDetailApi as Mock).mockResolvedValueOnce(mockResponse);
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.updateSecurityDetail({} as ISecurityUpdateRequest, onComplete);
    });

    expect(toast.success).toHaveBeenCalledWith('Security updated successfully');
    expect(result.current.isSecurityUpdating).toBe(false);
    expect(onComplete).toHaveBeenCalledWith('success');
  });

  it('handles error in updating security details', async () => {
    (PutSecurityDetailApi as Mock).mockRejectedValueOnce(new Error('Failed'));
    const onComplete = vi.fn();

    const { result } = renderHook(() => useManageUser());
    await act(async () => {
      result.current.updateSecurityDetail({} as ISecurityUpdateRequest, onComplete);
    });

    expect(result.current.isSecurityUpdating).toBe(false);
    expect(onComplete).toHaveBeenCalledWith('failure');
  });
});
