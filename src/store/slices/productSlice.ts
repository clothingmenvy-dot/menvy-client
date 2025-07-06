import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}


export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  userId: string;
}

export interface Brand {
  _id: string;
  name: string;
  createdAt: string;
  userId: string;
}

interface ProductState {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
}

// Async thunks for products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getProducts();
      return response.data; // Adjust based on your apiClient response structure
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk<Product, Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, { rejectValue: string }>(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      console.log('Creating product with data:', productData);
      const response = await apiClient.createProduct(productData);
      return response.data; // Adjust based on your apiClient response structure
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
  'products/updateProduct',
  async (product, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateProduct(product._id, product);
      return response.data; // Adjust based on your apiClient response structure
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await apiClient.deleteProduct(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete product');
    }
  }
);

// Async thunks for categories
export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getCategories();
      return response.data; // Adjust based on your apiClient response structure
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk<Category, Omit<Category, 'id' | 'createdAt'>, { rejectValue: string }>(
  'products/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await apiClient.createCategory(categoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'products/updateCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateCategory(category._id, category);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
  'products/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await apiClient.deleteCategory(categoryId);
      return categoryId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete category');
    }
  }
);

// Async thunks for brands
export const fetchBrands = createAsyncThunk<Brand[], void, { rejectValue: string }>(
  'products/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getBrands();
      return response.data; // Adjust based on your apiClient response structure
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch brands');
    }
  }
);

export const createBrand = createAsyncThunk<Brand, Omit<Brand, 'id' | 'createdAt'>, { rejectValue: string }>(
  'products/createBrand',
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await apiClient.createBrand(brandData);
      return response.data; // Adjust based on your apiClient response structure
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create brand');
    }
  }
);

export const updateBrand = createAsyncThunk<Brand, Brand, { rejectValue: string }>(
  'products/updateBrand',
  async (brand, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateBrand(brand._id, brand);
      return response.data; // Adjust based on your apiClient response structure
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update brand');
    }
  }
);

export const deleteBrand = createAsyncThunk<string, string, { rejectValue: string }>(
  'products/deleteBrand',
  async (brandId, { rejectWithValue }) => {
    try {
      await apiClient.deleteBrand(brandId);
      return brandId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete brand');
    }
  }
);

const initialState: ProductState = {
  products: [],
  categories: [
    { _id: '1', name: 'Electronics', createdAt: new Date().toISOString(), userId: 'system' },
    { _id: '2', name: 'Clothing', createdAt: new Date().toISOString(), userId: 'system' },
    { _id: '3', name: 'Books', createdAt: new Date().toISOString(), userId: 'system' },
    { _id: '4', name: 'Home & Garden', createdAt: new Date().toISOString(), userId: 'system' },
    { _id: '5', name: 'Sports', createdAt: new Date().toISOString(), userId: 'system' },
  ],
  brands: [
    { _id: '1', name: 'Apple', createdAt: new Date().toISOString(), userId: 'system' },
    { _id: '2', name: 'Samsung', createdAt: new Date().toISOString(), userId: 'system' },
    { _id: '3', name: 'Nike', createdAt: new Date().toISOString(), userId: 'system' },
    { _id: '4', name: 'Adidas', createdAt: new Date().toISOString(), userId: 'system' },
    { _id: '5', name: 'Generic', createdAt: new Date().toISOString(), userId: 'system' },
  ],
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete product';
      })
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        const systemCategories = state.categories.filter((c) => c.userId === 'system');
        const systemIds = new Set(systemCategories.map((c) => c._id));
        state.categories = [...systemCategories, ...action.payload.filter((c) => !systemIds.has(c._id))];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create category';
      })
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update category';
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete category';
      })
      // Brands
      .addCase(fetchBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        const systemBrands = state.brands.filter((b) => b.userId === 'system');
        const systemIds = new Set(systemBrands.map((b) => b._id));
        state.brands = [...systemBrands, ...action.payload.filter((b) => !systemIds.has(b._id))];
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch brands';
      })
      .addCase(createBrand.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands.push(action.payload);
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create brand';
      })
      .addCase(updateBrand.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.brands.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update brand';
      })
      .addCase(deleteBrand.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = state.brands.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete brand';
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;