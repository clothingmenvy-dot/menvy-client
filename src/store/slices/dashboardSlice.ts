/* eslint-disable @typescript-eslint/no-explicit-any */
// store/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface DashboardStats {
  totalProducts: number;
  totalSellers: number;
  totalSales: number;
  totalPurchases: number;
  totalRevenue: number;
  totalProfit: number;
  monthlyData: Array<{
    month: string;
    sales: number;
    purchases: number;
  }>;
}

interface DashboardState {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalProducts: 0,
    totalSellers: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalRevenue: 0,
    totalProfit: 0,
    monthlyData: [],
  },
  loading: false,
  error: null,
};

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v2/dashboard');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export const selectDashboard = (state: RootState) => state.dashboard;

export default dashboardSlice.reducer;