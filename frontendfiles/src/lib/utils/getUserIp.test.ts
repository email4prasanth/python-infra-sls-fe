// tests/utils/getUserIp.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getUserIp } from './getUserIp';

describe('getUserIp', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return IP address on success', async () => {
    const mockJson = vi.fn().mockResolvedValue({ ip: '192.168.1.1' });
    const mockFetch = vi.fn().mockResolvedValue({ json: mockJson });

    global.fetch = mockFetch;

    const ip = await getUserIp();
    expect(ip).toBe('192.168.1.1');
    expect(mockFetch).toHaveBeenCalledWith('https://api.ipify.org?format=json');
  });

  it('should return null and log error on failure', async () => {
    const mockConsole = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const ip = await getUserIp();
    expect(ip).toBeNull();
    expect(mockConsole).toHaveBeenCalledWith('Error fetching IP address:', expect.any(Error));
  });
});
