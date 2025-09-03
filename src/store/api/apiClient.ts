/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from '../../firebase/config';

class ApiClient {
  private baseURL: string;
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = 'https://menvy-server.vercel.app/api/v2') {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // Set a default timeout of 10 seconds
    });

    // Response interceptor for global error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          throw new Error('Authentication required. Please login again.');
        }
        if (error.response?.status === 403) {
          throw new Error('Access denied. You do not have permission to perform this action.');
        }
        throw new Error(`HTTP error! status: ${error.response?.status || 'unknown'}`);
      }
    );
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        return {
          Authorization: `Bearer ${token}`,
        };
      } catch (error) {
        console.error('Failed to get auth token:', error);
      }
    }
    return {};
  }

  private async request<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    const headers = await this.getAuthHeaders();
    try {
      const response: AxiosResponse<T> = await this.axiosInstance({
        url: endpoint,
        ...config,
        headers: {
          ...headers,
          ...config.headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Generic CRUD operations
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      data, // Axios automatically stringifies JSON
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      data,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Dashboard
  async getDashboard<T>(): Promise<T> {
    return this.get<T>('/dashboard');
  }

  // Products
  async getProducts<T>(): Promise<T> {
    return this.get<T>('/products');
  }

  async createProduct<T>(product: any): Promise<T> {
    return this.post<T>('/products', product);
  }

  async updateProduct<T>(id: string, product: any): Promise<T> {
    return this.put<T>(`/products/${id}`, product);
  }

  async deleteProduct<T>(id: string): Promise<T> {
    return this.delete<T>(`/products/${id}`);
  }

  // Categories
  async getCategories<T>(): Promise<T> {
    return this.get<T>('/categories');
  }

  async createCategory<T>(category: any): Promise<T> {
    return this.post<T>('/categories', category);
  }

  async updateCategory<T>(id: string, category: any): Promise<T> {
    return this.put<T>(`/categories/${id}`, category);
  }

  async deleteCategory<T>(id: string): Promise<T> {
    return this.delete<T>(`/categories/${id}`);
  }

  // Brands
  async getBrands<T>(): Promise<T> {
    return this.get<T>('/brands');
  }

  async createBrand<T>(brand: any): Promise<T> {
    return this.post<T>('/brands', brand);
  }

  async updateBrand<T>(id: string, brand: any): Promise<T> {
    return this.put<T>(`/brands/${id}`, brand);
  }

  async deleteBrand<T>(id: string): Promise<T> {
    return this.delete<T>(`/brands/${id}`);
  }

  // Sellers
  async getSellers<T>(): Promise<T> {
    return this.get<T>('/sellers');
  }

  async createSeller<T>(seller: any): Promise<T> {
    return this.post<T>('/sellers', seller);
  }

  async updateSeller<T>(id: string, seller: any): Promise<T> {
    return this.put<T>(`/sellers/${id}`, seller);
  }

  async deleteSeller<T>(id: string): Promise<T> {
    return this.delete<T>(`/sellers/${id}`);
  }

  // Sales
  async getSales<T>(): Promise<T> {
    return this.get<T>('/sales');
  }

  async createSale<T>(sale: any): Promise<T> {
    return this.post<T>('/sales', sale);
  }

  async updateSale<T>(id: string, sale: any): Promise<T> {
    return this.put<T>(`/sales/${id}`, sale);
  }

  async deleteSale<T>(id: string): Promise<T> {
    return this.delete<T>(`/sales/${id}`);
  }

  // Purchases
  async getPurchases<T>(): Promise<T> {
    return this.get<T>('/purchases');
  }

  async createPurchase<T>(purchase: any): Promise<T> {
    return this.post<T>('/purchases', purchase);
  }

  async updatePurchase<T>(id: string, purchase: any): Promise<T> {
    return this.put<T>(`/purchases/${id}`, purchase);
  }

  async deletePurchase<T>(id: string): Promise<T> {
    return this.delete<T>(`/purchases/${id}`);
  }

  // Users
  async getUsers<T>(): Promise<T> {
    return this.get<T>('/users');
  }

  async createUser<T>(user: any): Promise<T> {
    console.log('Creating user:', user);
    return this.post<T>('/users', user);
  }

  async updateUser<T>(id: string, user: any): Promise<T> {
    return this.put<T>(`/users/${id}`, user);
  }

  async deleteUser<T>(id: string): Promise<T> {
    return this.delete<T>(`/users/${id}`);
  }
}

export const apiClient = new ApiClient();