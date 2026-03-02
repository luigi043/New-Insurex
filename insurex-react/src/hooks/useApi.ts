import { useState, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { showSnackbar } from '../store/slices/uiSlice';

interface UseApiOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
  showErrorMessage?: boolean;
}

export const useApi = <T,>(options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const dispatch = useAppDispatch();

  const {
    showSuccessMessage = false,
    successMessage = 'Operation completed successfully',
    showErrorMessage = true,
  } = options;

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);
        
        if (showSuccessMessage) {
          dispatch(showSnackbar({ message: successMessage, severity: 'success' }));
        }
        
        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        
        if (showErrorMessage) {
          dispatch(showSnackbar({ message: errorMessage, severity: 'error' }));
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dispatch, showSuccessMessage, successMessage, showErrorMessage]
  );

  return {
    loading,
    error,
    data,
    execute,
    setData,
  };
};
