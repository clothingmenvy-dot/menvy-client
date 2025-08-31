/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  createCategory,
  deleteCategory,
  updateCategory,
  createBrand,
  deleteBrand,
  updateBrand,
  fetchCategories,
  fetchBrands
} from '../../store/slices/productSlice';
import { Plus, Trash2, Tag, Award, Edit, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

interface CategoryBrandManagerProps {
  activeTab: 'categories' | 'brands';
  onTabChange: (tab: 'categories' | 'brands') => void;
}

interface FormData {
  name: string;
}

interface EditFormData {
  id: string;
  name: string;
}

const CategoryBrandManager: React.FC<CategoryBrandManagerProps> = ({ activeTab, onTabChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, brands, isLoading } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [editingItem, setEditingItem] = useState<EditFormData | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const onSubmit = async (data: FormData) => {
    try {
      if (activeTab === 'categories') {
        // Check if category already exists
        const existingCategory = categories.find(c =>
          c.name.toLowerCase() === data.name.toLowerCase()
        );

        if (existingCategory) {
          Swal.fire('Error!', 'Category already exists.', 'error');
          return;
        }

        const categoryData = {
          name: data.name,
          userId: user?.uid || '',
        };

        await dispatch(createCategory(categoryData)).unwrap();
        Swal.fire('Success!', 'Category added successfully.', 'success');
      } else {
        // Check if brand already exists
        const existingBrand = brands.find(b =>
          b.name.toLowerCase() === data.name.toLowerCase()
        );

        if (existingBrand) {
          Swal.fire('Error!', 'Brand already exists.', 'error');
          return;
        }

        const brandData = {
          name: data.name,
          userId: user?.uid || '',
        };

        await dispatch(createBrand(brandData)).unwrap();
        Swal.fire('Success!', 'Brand added successfully.', 'success');
      }

      reset();
    } catch (error: any) {
      Swal.fire('Error!', error.message || `Failed to add ${activeTab.slice(0, -1)}. Please try again.`, 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `This will delete "${name}" and cannot be undone!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        if (activeTab === 'categories') {
          await dispatch(deleteCategory(id)).unwrap();
        } else {
          await dispatch(deleteBrand(id)).unwrap();
        }
        Swal.fire('Deleted!', `${activeTab.slice(0, -1)} has been deleted.`, 'success');
      }
    } catch (error: any) {
      Swal.fire('Error!', error.message || `Failed to delete ${activeTab.slice(0, -1)}.`, 'error');
    }
  };

  const startEditing = (item: any) => {
    setEditingItem({ id: item._id, name: item.name });
    setEditValue(item.name);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const saveEdit = async () => {
    if (!editingItem || !editValue.trim()) return;

    try {
      // Check if the new name already exists (excluding the current item)
      const currentItems = activeTab === 'categories' ? categories : brands;
      const existingItem = currentItems.find(item =>
        item.name.toLowerCase() === editValue.toLowerCase() && item._id !== editingItem.id
      );

      if (existingItem) {
        Swal.fire('Error!', `${activeTab.slice(0, -1)} with this name already exists.`, 'error');
        return;
      }

      if (activeTab === 'categories') {
        await dispatch(updateCategory({
          _id: editingItem.id,
          name: editValue,
          userId: user?.uid || '',
          createdAt: ''
        })).unwrap();
        Swal.fire('Success!', 'Category updated successfully.', 'success');
      } else {
        await dispatch(updateBrand({
          _id: editingItem.id,
          name: editValue,
          userId: user?.uid || '',
          createdAt: ''
        })).unwrap();
        Swal.fire('Success!', 'Brand updated successfully.', 'success');
      }

      setEditingItem(null);
      setEditValue('');
    } catch (error: any) {
      Swal.fire('Error!', error.message || `Failed to update ${activeTab.slice(0, -1)}.`, 'error');
    }
  };

  const currentItems = activeTab === 'categories' ? categories : brands;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => {
              onTabChange('categories');
              setEditingItem(null);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'categories'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories</span>
          </button>
          <button
            onClick={() => {
              onTabChange('brands');
              setEditingItem(null);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'brands'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Award className="w-4 h-4" />
            <span>Brands</span>
          </button>
        </nav>
      </div>

      <div className="p-6">
        {/* Add Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                {...register('name', {
                  required: `${activeTab.slice(0, -1)} name is required`,
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${activeTab.slice(0, -1)} name`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add {activeTab.slice(0, -1)}</span>
            </button>
          </div>
        </form>

        {/* Items List */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Existing {activeTab} ({currentItems.length})
          </h3>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} found. Add your first {activeTab.slice(0, -1)} above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingItem?.id === item._id ? (
                    // Edit mode
                    <div className="flex items-center w-full space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={handleEditChange}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Save"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    // Display mode
                    <>
                      <div className="flex items-center space-x-3">
                        {activeTab === 'categories' ? (
                          <Tag className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Award className="w-4 h-4 text-purple-600" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {item.userId !== 'system' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => startEditing(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, item.name)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryBrandManager;