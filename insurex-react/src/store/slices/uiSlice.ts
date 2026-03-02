import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  loading: { [key: string]: boolean };
  errors: { [key: string]: string | null };
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  };
}

const initialState: UIState = {
  loading: {},
  errors: {},
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
    setError: (state, action: PayloadAction<{ key: string; error: string | null }>) => {
      state.errors[action.payload.key] = action.payload.error;
    },
    showSnackbar: (state, action: PayloadAction<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.snackbar.open = true;
      state.snackbar.message = action.payload.message;
      state.snackbar.severity = action.payload.severity;
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    clearErrors: (state) => {
      state.errors = {};
    },
  },
});

export const { setLoading, setError, showSnackbar, hideSnackbar, clearErrors } = uiSlice.actions;
export default uiSlice.reducer;
