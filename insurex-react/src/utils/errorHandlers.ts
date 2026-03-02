// src/utils/errorHandlers.ts
export const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data.message || 'Server error';
  }
  if (error.request) {
    return 'Network error';
  }
  return error.message || 'Unknown error';
};