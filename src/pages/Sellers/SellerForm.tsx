import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { createSeller, updateSeller } from '../../store/slices/sellerSlice';
import type { Seller } from '../../store/slices/sellerSlice';
import Swal from 'sweetalert2';

interface SellerFormProps {
  seller?: Seller | null;
  onClose: () => void;
}

interface SellerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const SellerForm: React.FC<SellerFormProps> = ({ seller, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.sellers);

  const { register, handleSubmit, formState: { errors } } = useForm<SellerFormData>({
    defaultValues: seller ? {
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      address: seller.address,
    } : undefined
  });

  const onSubmit = async (data: SellerFormData) => {
    try {
      if (seller) {
        // Update existing seller
        const updatedSeller: Seller = {
          ...seller,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        await dispatch(updateSeller(updatedSeller)).unwrap();
        Swal.fire('Success!', 'Seller updated successfully.', 'success');
      } else {
        // Add new seller
        await dispatch(createSeller(data)).unwrap();
        Swal.fire('Success!', 'Seller added successfully.', 'success');
      }
      
      onClose();
    } catch (error: any) {
      Swal.fire('Error!', error.message || 'Failed to save seller. Please try again.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email address',
            },
          })}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          {...register('phone', { required: 'Phone number is required' })}
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <textarea
          {...register('address', { required: 'Address is required' })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter complete address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="flex space-x-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {seller ? 'Update Seller' : 'Add Seller'}
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

export default SellerForm;