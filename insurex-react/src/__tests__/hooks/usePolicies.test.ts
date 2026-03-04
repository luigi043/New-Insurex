import { renderHook, act } from '@testing-library/react';
import { usePolicies } from '../../hooks/usePolicies';
import { policyService } from '../../services/policy.service';
import { vi } from 'vitest';

// Mock policyService
vi.mock('../../services/policy.service', () => ({
    policyService: {
        getAll: vi.fn(),
        getById: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        getStats: vi.fn(),
    },
}));

describe('usePolicies Hook', () => {
    const mockPolicies = [
        { id: '1', policyNumber: 'POL-001', type: 'AUTO', status: 'ACTIVE', holderName: 'John Doe' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch policies on initialization', async () => {
        (policyService.getAll as any).mockResolvedValue({ data: mockPolicies, total: 1, totalPages: 1, page: 1, limit: 10 });

        const { result } = renderHook(() => usePolicies());

        await act(async () => {
            await result.current.fetchPolicies();
        });

        expect(result.current.policies).toEqual(mockPolicies);
    });

    it('should create a new policy', async () => {
        const newPolicy = { policyNumber: 'POL-002', type: 'HOME', holderName: 'Jane Smith' };
        (policyService.create as any).mockResolvedValue({ id: '2', ...newPolicy });

        const { result } = renderHook(() => usePolicies());

        await act(async () => {
            await result.current.createPolicy(newPolicy as any);
        });

        expect(policyService.create).toHaveBeenCalledWith(newPolicy);
    });
});
