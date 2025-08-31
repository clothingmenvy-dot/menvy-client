/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { createSale, updateSale } from '../../store/slices/saleSlice';
import { fetchProducts } from '../../store/slices/productSlice';
import { fetchSellers } from '../../store/slices/sellerSlice';
import type { Sale } from '../../store/slices/saleSlice';
import Swal from 'sweetalert2';

interface SaleFormProps {
  sale?: Sale | null;
  onClose: () => void;
}

interface SaleFormData {
  productId: string;
  sellerId: string;
  quantity: number;
  price: number;
}

const SaleForm: React.FC<SaleFormProps> = ({ sale, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.products);
  const { sellers } = useSelector((state: RootState) => state.sellers);
  const { isLoading } = useSelector((state: RootState) => state.sales);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SaleFormData>({
    defaultValues: sale ? {
      productId: sale.productId,
      sellerId: sale.sellerId || '',
      quantity: sale.quantity,
      price: sale.price,
    } : undefined
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSellers());
  }, [dispatch]);

  const watchedQuantity = watch('quantity');
  const watchedPrice = watch('price');
  const total = (watchedQuantity || 0) * (watchedPrice || 0);

  const onSubmit = async (data: SaleFormData) => {
    try {
      const selectedProduct = products.find(p => p._id === data.productId);
      const selectedSeller = sellers.find(s => s._id === data.sellerId);

      const saleData = {
        ...data,
        total: data.quantity * data.price,
        productName: selectedProduct?.name || '',
        sellerName: selectedSeller?.name || '',
      };

      if (sale) {
        // Update existing sale
        const updatedSale: Sale = {
          ...sale,
          ...saleData,
          updatedAt: new Date().toISOString(),
        };
        await dispatch(updateSale(updatedSale)).unwrap();
        Swal.fire('Success!', 'Sale updated successfully.', 'success');
      } else {
        // Add new sale
        await dispatch(createSale(saleData)).unwrap();
        Swal.fire('Success!', 'Sale recorded successfully.', 'success');
      }

      onClose();
    } catch (error: any) {
      Swal.fire('Error!', error.message || 'Failed to save sale. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product *
        </label>
        <select
          {...register('productId', { required: 'Product is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select product</option>
          {products.map(product => (
            <option key={product._id} value={product._id}>
              {product.name} - ৳{product.price}
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seller
        </label>
        <select
          {...register('sellerId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select seller (optional)</option>
          {sellers.map(seller => (
            <option key={seller._id} value={seller._id}>
              {seller.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            {...register('quantity', {
              required: 'Quantity is required',
              min: { value: 1, message: 'Quantity must be at least 1' }
            })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit Price *
          </label>
          <input
            {...register('price', {
              required: 'Price is required',
              min: { value: 0.01, message: 'Price must be positive' }
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
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700">Total:</span>
          <span className="text-2xl font-bold text-green-600">
            ৳{total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex space-x-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {sale ? 'Update Sale' : 'Record Sale'}
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

export default SaleForm;