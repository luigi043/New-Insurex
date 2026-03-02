import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { policyService } from '../../services/policy.service';
import { Policy, PolicyFilter } from '../../types/policy.types';

interface PolicyState {
  policies: Policy[];
  selectedPolicy: Policy | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  filters: PolicyFilter;
}

const initialState: PolicyState = {
  policies: [],
  selectedPolicy: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  pageSize: 10,
  filters: {},
};

export const fetchPolicies = createAsyncThunk(
  'policy/fetchPolicies',
  async ({ page, pageSize, filters }: { page: number; pageSize: number; filters: PolicyFilter }) => {
    const response = await policyService.getPolicies(page, pageSize, filters);
    return response;
  }
);

export const fetchPolicyById = createAsyncThunk(
  'policy/fetchPolicyById',
  async (id: string) => {
    const response = await policyService.getPolicy(id);
    return response;
  }
);

export const createPolicy = createAsyncThunk(
  'policy/createPolicy',
  async (data: any) => {
    const response = await policyService.createPolicy(data);
    return response;
  }
);

export const updatePolicy = createAsyncThunk(
  'policy/updatePolicy',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await policyService.updatePolicy(id, data);
    return response;
  }
);

export const deletePolicy = createAsyncThunk(
  'policy/deletePolicy',
  async (id: string) => {
    await policyService.deletePolicy(id);
    return id;
  }
);

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<PolicyFilter>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    clearSelectedPolicy: (state) => {
      state.selectedPolicy = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Policies
      .addCase(fetchPolicies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.policies = action.payload.items;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar apólices';
      })
      // Fetch Policy by ID
      .addCase(fetchPolicyById.fulfilled, (state, action) => {
        state.selectedPolicy = action.payload;
      })
      // Create Policy
      .addCase(createPolicy.fulfilled, (state) => {
        state.loading = false;
      })
      // Update Policy
      .addCase(updatePolicy.fulfilled, (state, action) => {
        state.selectedPolicy = action.payload;
      })
      // Delete Policy
      .addCase(deletePolicy.fulfilled, (state, action) => {
        state.policies = state.policies.filter(p => p.id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters, setPage, setPageSize, clearSelectedPolicy } = policySlice.actions;
export default policySlice.reducer;
