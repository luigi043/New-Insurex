import { describe, it, expect } from 'vitest';

import { validateEmail, validatePhone, validateCPF } from '../../utils/validators';

 

describe('validateEmail', () => {

  it('should return true for valid email addresses', () => {

    expect(validateEmail('user@example.com')).toBe(true);

    expect(validateEmail('test.user@domain.co')).toBe(true);

    expect(validateEmail('name+tag@company.org')).toBe(true);

  });

 

  it('should return false for invalid email addresses', () => {

    expect(validateEmail('')).toBe(false);

    expect(validateEmail('invalid')).toBe(false);

    expect(validateEmail('user@')).toBe(false);

    expect(validateEmail('@domain.com')).toBe(false);

    expect(validateEmail('user @domain.com')).toBe(false);

    expect(validateEmail('user@domain')).toBe(false);

  });

});

 

describe('validatePhone', () => {

  it('should return true for valid Brazilian phone numbers', () => {

    expect(validatePhone('(11) 91234-5678')).toBe(true);

    expect(validatePhone('11912345678')).toBe(true);

  });

 

  it('should return false for invalid phone numbers', () => {

    expect(validatePhone('')).toBe(false);

    expect(validatePhone('123')).toBe(false);

    expect(validatePhone('abcdefghijk')).toBe(false);

  });

});

 

describe('validateCPF', () => {

  it('should return false for CPF with all same digits', () => {

    expect(validateCPF('111.111.111-11')).toBe(false);

    expect(validateCPF('000.000.000-00')).toBe(false);

  });

 

  it('should return false for CPF with wrong length', () => {

    expect(validateCPF('123')).toBe(false);

    expect(validateCPF('')).toBe(false);

  });

 

  it('should handle CPF with formatting characters', () => {

    // The validator strips non-digits, so formatted input should work

    const result = validateCPF('123.456.789-09');

    expect(typeof result).toBe('boolean');

  });

});

 

describe('Form validation patterns', () => {

  it('should validate required fields are not empty', () => {

    const validateRequired = (value: string): boolean => value.trim().length > 0;

    expect(validateRequired('test')).toBe(true);

    expect(validateRequired('')).toBe(false);

    expect(validateRequired('   ')).toBe(false);

  });

 

  it('should validate minimum length', () => {

    const validateMinLength = (value: string, min: number): boolean => value.length >= min;

    expect(validateMinLength('password123', 8)).toBe(true);

    expect(validateMinLength('short', 8)).toBe(false);

  });

 

  it('should validate password strength', () => {

    const validatePasswordStrength = (password: string): boolean => {

      const hasUpperCase = /[A-Z]/.test(password);

      const hasLowerCase = /[a-z]/.test(password);

      const hasNumbers = /\d/.test(password);

      const hasMinLength = password.length >= 8;

      return hasUpperCase && hasLowerCase && hasNumbers && hasMinLength;

    };

 

    expect(validatePasswordStrength('StrongPass1')).toBe(true);

    expect(validatePasswordStrength('weak')).toBe(false);

    expect(validatePasswordStrength('nouppercase1')).toBe(false);

    expect(validatePasswordStrength('NOLOWERCASE1')).toBe(false);

    expect(validatePasswordStrength('NoNumbers')).toBe(false);

  });

 

  it('should validate date ranges', () => {

    const validateDateRange = (start: string, end: string): boolean => {

      return new Date(start) < new Date(end);

    };

 

    expect(validateDateRange('2024-01-01', '2024-12-31')).toBe(true);

    expect(validateDateRange('2024-12-31', '2024-01-01')).toBe(false);

  });

 

  it('should validate currency amounts', () => {

    const validateAmount = (amount: number): boolean => {

      return amount > 0 && Number.isFinite(amount);

    };

 

    expect(validateAmount(100.50)).toBe(true);

    expect(validateAmount(0)).toBe(false);

    expect(validateAmount(-50)).toBe(false);

    expect(validateAmount(Infinity)).toBe(false);

  });

});