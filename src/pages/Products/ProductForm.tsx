/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { createProduct, updateProduct, fetchCategories, fetchBrands } from '../../store/slices/productSlice';
import type { Product } from '../../store/slices/productSlice';
import Swal from 'sweetalert2';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

interface ProductFormData {
  _id?: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  sku: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, brands, isLoading } = useSelector((state: RootState) => state.products);
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: product
      ? {
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
      }
      : { name: '', description: '', category: '', brand: '', price: 0, stock: 0, sku: '' }
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        // Update existing product
        const updatedProduct: Product = {
          ...product,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        await dispatch(updateProduct(updatedProduct)).unwrap();
        Swal.fire('Success!', 'Product updated successfully.', 'success');
      } else {
        // Add new product
        const newProductData = {
          ...data,
        };
        await dispatch(createProduct(newProductData)).unwrap();
        Swal.fire('Success!', 'Product added successfully.', 'success');
      }
      onClose();
    } catch (error: any) {
      Swal.fire('Error!', error.message || 'Failed to save product. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            {...register('name', { required: 'Product name is required' })}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <input
            {...register('sku', { required: 'SKU is required' })}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter SKU manually"
          />
          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand *
          </label>
          <select
            {...register('brand', { required: 'Brand is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select brand</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand.name}>{brand.name}</option>
            ))}
          </select>
          {errors.brand && (
            <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity *
          </label>
          <input
            {...register('stock', {
              required: 'Stock quantity is required',
              min: { value: 0, message: 'Stock must be positive' }
            })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter product description"
        />
      </div>

      <div className="flex space-x-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {product ? 'Update Product' : 'Add Product'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;