import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';

describe('formatCurrency', () => {
  it('should format number as BRL currency', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });
  
  it('should format zero as R$ 0,00', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });
});
