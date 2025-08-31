import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productSlice from './slices/productSlice';
import sellerSlice from './slices/sellerSlice';
import saleSlice from './slices/saleSlice';
import purchaseSlice from './slices/purchaseSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    sellers: sellerSlice,
    sales: saleSlice,
    purchases: purchaseSlice,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;