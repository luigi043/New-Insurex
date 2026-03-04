import { renderHook, act } from '@testing-library/react';
import { useClaims } from '../../hooks/useClaims';
import { claimService } from '../../services/claim.service';
import { vi, expect, describe, it, beforeEach } from 'vitest';

// Mock claimService
vi.mock('../../services/claim.service', () => ({
    claimService: {
        getAll: vi.fn(),
        getById: vi.fn(),
        approve: vi.fn(),
        reject: vi.fn(),
        create: vi.fn(),
        getStats: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        submit: vi.fn(),
        settle: vi.fn(),
    },
}));

describe('useClaims Hook', () => {
    const mockClaims = [
        { id: '1', claimNumber: 'CLM-001', status: 'PENDING', claimantName: 'John Doe', type: 'AUTO' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch claims on initialization', async () => {
        (claimService.getAll as any).mockResolvedValue({ data: mockClaims, total: 1, totalPages: 1, page: 1, limit: 10 });

        const { result } = renderHook(() => useClaims({ autoFetch: false }));

        await act(async () => {
            await result.current.fetchClaims();
        });

        expect(result.current.claims).toEqual(mockClaims);
    });

    it('should approve a claim', async () => {
        (claimService.approve as any).mockResolvedValue({ id: '1', status: 'APPROVED' });

        const { result } = renderHook(() => useClaims({ autoFetch: false }));

        await act(async () => {
            await result.current.approveClaim('1', 1000, 'Test notes');
        });

        expect(claimService.approve).toHaveBeenCalledWith('1', 1000, 'Test notes');
    });
});
