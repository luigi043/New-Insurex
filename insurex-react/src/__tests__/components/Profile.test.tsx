import { describe, it, expect, vi, beforeEach } from 'vitest';
<<<<<<< HEAD
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock hooks
const mockUpdateProfile = vi.fn();
const mockChangePassword = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '(11) 91234-5678',
      document: '123.456.789-00',
      position: 'Manager',
      department: 'Insurance',
      avatar: '',
    },
    updateProfile: mockUpdateProfile,
    changePassword: mockChangePassword,
    loading: false,
    isAuthenticated: true,
  }),
}));

vi.mock('../../hooks/useNotification', () => ({
  useNotification: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showNotification: vi.fn(),
    notifications: [],
    hideNotification: vi.fn(),
    clearAll: vi.fn(),
  }),
}));

import { Profile } from '../../pages/profile/Profile';

const renderProfile = () => {
  return render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>
  );
};

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render profile page with user name', () => {
    renderProfile();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render profile tabs', () => {
    renderProfile();
    expect(screen.getByText(/Informações Pessoais/i)).toBeInTheDocument();
    expect(screen.getByText(/Empresa/i)).toBeInTheDocument();
    expect(screen.getByText(/Segurança/i)).toBeInTheDocument();
  });

  it('should render edit button', () => {
    renderProfile();
    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();
  });

  it('should show form fields as disabled when not editing', () => {
    renderProfile();
    const emailField = screen.getByLabelText('E-mail');
    expect(emailField).toBeDisabled();
  });

  it('should enable form fields when edit button is clicked', () => {
    renderProfile();
    const editButton = screen.getByText('Editar Perfil');
    fireEvent.click(editButton);

    const emailField = screen.getByLabelText('E-mail');
    expect(emailField).not.toBeDisabled();
  });

  it('should show save and cancel buttons when editing', () => {
    renderProfile();
    fireEvent.click(screen.getByText('Editar Perfil'));

    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should display user information in form fields', () => {
    renderProfile();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });
=======

import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';

import React from 'react';

 

// Mock hooks

const mockUpdateProfile = vi.fn();

const mockChangePassword = vi.fn();

 

vi.mock('../../hooks/useAuth', () => ({

  useAuth: () => ({

    user: {

      id: '1',

      firstName: 'John',

      lastName: 'Doe',

      email: 'john@example.com',

      phone: '(11) 91234-5678',

      document: '123.456.789-00',

      position: 'Manager',

      department: 'Insurance',

      avatar: '',

    },

    updateProfile: mockUpdateProfile,

    changePassword: mockChangePassword,

    loading: false,

    isAuthenticated: true,

  }),

}));

 

vi.mock('../../hooks/useNotification', () => ({

  useNotification: () => ({

    showSuccess: vi.fn(),

    showError: vi.fn(),

    showNotification: vi.fn(),

    notifications: [],

    hideNotification: vi.fn(),

    clearAll: vi.fn(),

  }),

}));

 

import { Profile } from '../../pages/profile/Profile';

 

const renderProfile = () => {

  return render(

    <BrowserRouter>

      <Profile />

    </BrowserRouter>

  );

};

 

describe('Profile Page', () => {

  beforeEach(() => {

    vi.clearAllMocks();

  });

 

  it('should render profile page with user name', () => {

    renderProfile();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

  });

 

  it('should render profile tabs', () => {

    renderProfile();

    expect(screen.getByText(/Informações Pessoais/i)).toBeInTheDocument();

    expect(screen.getByText(/Empresa/i)).toBeInTheDocument();

    expect(screen.getByText(/Segurança/i)).toBeInTheDocument();

  });

 

  it('should render edit button', () => {

    renderProfile();

    expect(screen.getByText('Editar Perfil')).toBeInTheDocument();

  });

 

  it('should show form fields as disabled when not editing', () => {

    renderProfile();

    const emailField = screen.getByLabelText('E-mail');

    expect(emailField).toBeDisabled();

  });

 

  it('should enable form fields when edit button is clicked', () => {

    renderProfile();

    const editButton = screen.getByText('Editar Perfil');

    fireEvent.click(editButton);

 

    const emailField = screen.getByLabelText('E-mail');

    expect(emailField).not.toBeDisabled();

  });

 

  it('should show save and cancel buttons when editing', () => {

    renderProfile();

    fireEvent.click(screen.getByText('Editar Perfil'));

 

    expect(screen.getByText('Salvar')).toBeInTheDocument();

    expect(screen.getByText('Cancelar')).toBeInTheDocument();

  });

 

  it('should display user information in form fields', () => {

    renderProfile();

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();

    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();

    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();

  });

>>>>>>> main
});
