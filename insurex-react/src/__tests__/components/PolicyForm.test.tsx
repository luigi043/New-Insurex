import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, expect, describe, it, beforeEach } from 'vitest';
import { PolicyForm } from '../../pages/policies/PolicyForm';
import { NotificationProvider } from '../../components/Notifications/NotificationProvider';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: undefined }),
    };
});

// Mock policyService
vi.mock('../../services/policy.service', () => ({
    policyService: {
        getPolicy: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        createPolicy: vi.fn(),
        updatePolicy: vi.fn(),
    },
}));

describe('PolicyForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render create policy form', () => {
        render(
            <BrowserRouter>
                <NotificationProvider>
                    <PolicyForm />
                </NotificationProvider>
            </BrowserRouter>
        );

        // Use broader matchers to handle potential language differences
        expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(/Policy|Apólica|Apólice/i);
        expect(screen.getByLabelText(/Number|Número/i)).toBeInTheDocument();
    });
});
