/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';

export interface Purchase {
  _id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  supplierId?: string;
  supplierName?: string;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseState {
  purchases: Purchase[];
  isLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchPurchases = createAsyncThunk<Purchase[], void, { rejectValue: string }>(
  'purchases/fetchPurchases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getPurchases();
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch purchases');
    }
  }
);

export const createPurchase = createAsyncThunk<Purchase, Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>, { rejectValue: string }>(
  'purchases/createPurchase',
  async (purchaseData, { rejectWithValue }) => {
    try {
      console.log('Creating purchase with data:', purchaseData);
      const response = await apiClient.createPurchase(purchaseData);
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create purchase');
    }
  }
);

export const updatePurchase = createAsyncThunk<Purchase, Purchase, { rejectValue: string }>(
  'purchases/updatePurchase',
  async (purchase, { rejectWithValue }) => {
    try {
      const response = await apiClient.updatePurchase(purchase._id, purchase);
      return response.data; // Return only the data portion
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update purchase');
    }
  }
);

export const deletePurchase = createAsyncThunk<string, string, { rejectValue: string }>(
  'purchases/deletePurchase',
  async (purchaseId, { rejectWithValue }) => {
    try {
      await apiClient.deletePurchase(purchaseId);
      return purchaseId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete purchase');
    }
  }
);

const initialState: PurchaseState = {
  purchases: [],
  isLoading: false,
  error: null,
};

const purchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Purchases
      .addCase(fetchPurchases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchases = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch purchases';
      })
      // Create Purchase
      .addCase(createPurchase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchases.push(action.payload);
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create purchase';
      })
      // Update Purchase
      .addCase(updatePurchase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.purchases.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.purchases[index] = action.payload;
        }
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update purchase';
      })
      // Delete Purchase
      .addCase(deletePurchase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchases = state.purchases.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete purchase';
      });
  },
});

export const { clearError } = purchaseSlice.actions;
export default purchaseSlice.reducer;