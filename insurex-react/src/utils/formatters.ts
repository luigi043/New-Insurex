/**
 * Format a number as currency
 */
export const formatCurrency = (value: number | undefined | null, currency: string = 'USD'): string => {
  if (value === undefined || value === null) return '-';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a date string
 */
export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return '-';

  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(d);
};

/**
 * Format a date with time
 */
export const formatDateTime = (date: string | Date | undefined | null): string => {
  if (!date) return '-';

  const d = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

/**
 * Format a number with commas
 */
export const formatNumber = (value: number | undefined | null, decimals: number = 0): string => {
  if (value === undefined || value === null) return '-';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format a percentage
 */
export const formatPercent = (value: number | undefined | null, decimals: number = 2): string => {
  if (value === undefined || value === null) return '-';

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Format a phone number
 */
export const formatPhone = (phone: string | undefined | null): string => {
  if (!phone) return '-';

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
};

/**
 * Format an address
 */
export const formatAddress = (
  address: string,
  city?: string,
  state?: string,
  zipCode?: string,
  country?: string
): string => {
  const parts: string[] = [address];

  if (city || state || zipCode) {
    const cityStateZip = [city, state && zipCode ? `${state} ${zipCode}` : state || zipCode]
      .filter(Boolean)
      .join(', ');
    if (cityStateZip) parts.push(cityStateZip);
  }

  if (country) parts.push(country);

  return parts.filter(Boolean).join('\n');
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number | undefined | null): string => {
  if (bytes === undefined || bytes === null) return '-';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * Format duration in milliseconds to human readable string
 */
export const formatDuration = (ms: number | undefined | null): string => {
  if (ms === undefined || ms === null) return '-';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string | undefined | null): string => {
  if (!text) return '-';

  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format enum value to readable string
 */
export const formatEnum = (value: string | undefined | null): string => {
  if (!value) return '-';

  // Insert spaces before capital letters and capitalize first letter
  return value
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/^./, str => str.toUpperCase());
};

/**
 * Format a relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date | undefined | null): string => {
  if (!date) return '-';

  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(d);
};
