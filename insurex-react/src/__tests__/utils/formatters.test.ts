import { formatCurrency, formatDate } from '../../utils/formatters';
import { describe, it, expect } from 'vitest';

describe('Formatter Utilities', () => {
  describe('formatCurrency', () => {
    it('should format number as currency', () => {
      const result = formatCurrency(1234.56, 'BRL');
      // Matches 1.234,56 (pt-BR) or 1,234.56 (en-US fallback)
      expect(result).toMatch(/1.*234.*56/);
    });

    it('should format zero correctly', () => {
      const result = formatCurrency(0, 'BRL');
      expect(result).toMatch(/0.*00/);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2023-12-25';
      const formatted = formatDate(date);
      // Matches DD/MM/YYYY or YYYY-MM-DD or other formats depending on environment
      // but we expect something containing 25, 12, 2023
      expect(formatted).toContain('25');
      expect(formatted).toContain('2023');
    });

    it('should handle falsy dates', () => {
      expect(formatDate(null)).toBe('-');
    });
  });
});
