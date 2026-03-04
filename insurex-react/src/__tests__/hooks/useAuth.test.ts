import { renderHook, act } from '@testing-library/react';
import { useAuthProvider } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { vi, expect, describe, it, beforeEach } from 'vitest';

// Mock authService
vi.mock('../../services/auth.service', () => ({
    authService: {
        login: vi.fn(),
        logout: vi.fn(),
        isAuthenticated: vi.fn(),
        getCurrentUser: vi.fn(),
        refreshToken: vi.fn(),
        getStoredUser: vi.fn(),
    },
}));

describe('useAuth Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (authService.isAuthenticated as any).mockReturnValue(false);
        (authService.getStoredUser as any).mockReturnValue(null);
    });

    it('should handle initial state', async () => {
        const { result } = renderHook(() => useAuthProvider());

        // It might be true or false depending on how fast the useEffect runs
        // but initially it's true in the state definition
        expect(result.current.isLoading).toBeDefined();

        await act(async () => {
            // Let effects run
        });

        expect(result.current.isLoading).toBe(false);
    });

    it('should call login and update user state', async () => {
        const mockUser = { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' };
        (authService.login as any).mockResolvedValue({ user: mockUser, accessToken: 'abc', refreshToken: 'def' });

        const { result } = renderHook(() => useAuthProvider());

        await act(async () => {
            await result.current.login({ email: 'test@example.com', password: 'password' });
        });

        expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
        expect(result.current.user).toEqual(mockUser);
    });
});
