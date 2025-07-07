import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';

export interface Seller {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface SellerState {
  sellers: Seller[];
  isLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchSellers = createAsyncThunk<Seller[], void, { rejectValue: string }>(
  'sellers/fetchSellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getSellers() as { data: Seller[] };
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch sellers');
    }
  }
);

export const createSeller = createAsyncThunk<Seller, Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>, { rejectValue: string }>(
  'sellers/createSeller',
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await apiClient.createSeller(sellerData);
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create seller');
    }
  }
);

export const updateSeller = createAsyncThunk<Seller, Seller, { rejectValue: string }>(
  'sellers/updateSeller',
  async (seller, { rejectWithValue }) => {
    try {
      const response = await apiClient.competitorsUpdateSeller(seller._id, seller);
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update seller');
    }
  }
);

export const deleteSeller = createAsyncThunk<string, string, { rejectValue: string }>(
  'sellers/deleteSeller',
  async (sellerId, { rejectWithValue }) => {
    try {
      await apiClient.deleteSeller(sellerId);
      return sellerId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete seller');
    }
  }
);

const initialState: SellerState = {
  sellers: [],
  isLoading: false,
  error: null,
};

const sellerSlice = createSlice({
  name: 'sellers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sellers
      .addCase(fetchSellers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellers = action.payload;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch sellers';
      })
      // Create Seller
      .addCase(createSeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellers.push(action.payload);
      })
      .addCase(createSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create seller';
      })
      // Update Seller
      .addCase(updateSeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.sellers.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.sellers[index] = action.payload;
        }
      })
      .addCase(updateSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update seller';
      })
      // Delete Seller
      .addCase(deleteSeller.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSeller.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellers = state.sellers.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSeller.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete seller';
      });
  },
});

export const { clearError } = sellerSlice.actions;
export default sellerSlice.reducer;