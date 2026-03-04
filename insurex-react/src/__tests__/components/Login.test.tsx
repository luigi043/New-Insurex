import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, expect, describe, it, beforeEach } from 'vitest';
import { Login } from '../../pages/auth/Login';
import * as useAuthHook from '../../hooks/useAuth';

// Mock useAuth
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('Login Component', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    (useAuthHook.useAuth as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in|entrar/i })).toBeInTheDocument();
  });

  it('should call login function on form submission', async () => {
    (useAuthHook.useAuth as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email|e-mail/i);
    const passwordInput = screen.getByLabelText(/password|senha/i);
    const submitButton = screen.getByRole('button', { name: /sign in|entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('should show error message when login fails', () => {
    (useAuthHook.useAuth as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid credentials',
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText(/invalid credentials|credenciais inválidas/i)).toBeInTheDocument();
  });

  it('should show loading state', () => {
    (useAuthHook.useAuth as any).mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});