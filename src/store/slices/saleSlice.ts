import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';

export interface Sale {
  _id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  sellerId?: string;
  sellerName?: string;
  createdAt: string;
  updatedAt: string;
}

interface SaleState {
  sales: Sale[];
  isLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchSales = createAsyncThunk<Sale[], void, { rejectValue: string }>(
  'sales/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getSales();
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch sales');
    }
  }
);

export const createSale = createAsyncThunk<Sale, Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>, { rejectValue: string }>(
  'sales/createSale',
  async (saleData, { rejectWithValue }) => {
    try {
      console.log('Creating sale with data:', saleData);
      const response = await apiClient.createSale(saleData);
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create sale');
    }
  }
);

export const updateSale = createAsyncThunk<Sale, Sale, { rejectValue: string }>(
  'sales/updateSale',
  async (sale, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateSale(sale._id, sale);
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update sale');
    }
  }
);

export const deleteSale = createAsyncThunk<string, string, { rejectValue: string }>(
  'sales/deleteSale',
  async (saleId, { rejectWithValue }) => {
    try {
      await apiClient.deleteSale(saleId);
      return saleId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete sale');
    }
  }
);

const initialState: SaleState = {
  sales: [],
  isLoading: false,
  error: null,
};

const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sales
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch sales';
      })
      // Create Sale
      .addCase(createSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales.push(action.payload);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create sale';
      })
      // Update Sale
      .addCase(updateSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.sales.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.sales[index] = action.payload;
        }
      })
      .addCase(updateSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update sale';
      })
      // Delete Sale
      .addCase(deleteSale.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sales = state.sales.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSale.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete sale';
      });
  },
});

export const { clearError } = saleSlice.actions;
export default saleSlice.reducer;