/**
 * Format currency value to Brazilian Real
 */
export const formatCurrency = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return 'R$ 0,00';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numValue);
};

/**
 * Format date to Brazilian format
 */
export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Format date and time to Brazilian format
 */
export const formatDateTime = (date: string | Date | undefined | null): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '-';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Format CPF/CNPJ document
 */
export const formatDocument = (document: string | undefined | null): string => {
  if (!document) return '-';
  
  const cleanDoc = document.replace(/\D/g, '');
  
  if (cleanDoc.length === 11) {
    // CPF
    return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (cleanDoc.length === 14) {
    // CNPJ
    return cleanDoc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return document;
};

/**
 * Format phone number
 */
export const formatPhone = (phone: string | undefined | null): string => {
  if (!phone) return '-';
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 11) {
    // Mobile
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 10) {
    // Landline
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Format CEP (Brazilian ZIP code)
 */
export const formatCEP = (cep: string | undefined | null): string => {
  if (!cep) return '-';
  
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length === 8) {
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return cep;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return '0%';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0%';
  
  return `${numValue.toFixed(2)}%`;
};

/**
 * Format number with Brazilian separators
 */
export const formatNumber = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) return '0';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('pt-BR').format(numValue);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string | undefined | null): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  
  const cleanValue = value
    .replace('R$', '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim();
  
  const numValue = parseFloat(cleanValue);
  
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Get relative time (e.g., "há 2 horas")
 */
export const getRelativeTime = (date: string | Date | undefined | null): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'agora mesmo';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `há ${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''}`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `há ${diffInYears} ano${diffInYears > 1 ? 's' : ''}`;
};
