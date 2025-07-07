import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Plus, Edit, Trash2, Search, Filter, Settings } from 'lucide-react';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import ProductForm from './ProductForm';
import CategoryBrandManager from '../../components/Products/CategoryBrandManager';
import { deleteProduct, fetchProducts, fetchCategories, fetchBrands } from '../../store/slices/productSlice';
import Swal from 'sweetalert2';
import type { Product } from '../../store/slices/productSlice';

const Products: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, categories, brands, isLoading } = useSelector((state: RootState) => state.products);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryBrandModalOpen, setIsCategoryBrandModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryBrandTab, setCategoryBrandTab] = useState<'categories' | 'brands'>('categories');
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesBrand = !brandFilter || product.brand === brandFilter;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, searchTerm, categoryFilter, brandFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await dispatch(deleteProduct(productId)).unwrap();
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
      }
    } catch (error: any) {
      Swal.fire('Error!', error.message || 'Failed to delete product.', 'error');
    }
  };

  const handleProductModalClose = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleCategoryBrandModalClose = () => {
    setIsCategoryBrandModalOpen(false);
  };

  const columns = [
    { key: 'name', header: 'Product Name' },
    { key: 'sku', header: 'SKU' },
    { key: 'category', header: 'Category' },
    { key: 'brand', header: 'Brand' },
    {
      key: 'price',
      header: 'Price',
      render: (value: number) => `৳${value.toFixed(2)}`
    },
    {
      key: 'stock',
      header: 'Stock',
      render: (value: number) => (
        <span className={`px-2 py-1 rounded-full text-xs ${value > 10 ? 'bg-green-100 text-green-800' :
            value > 0 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
          }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, product: Product) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(product)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsCategoryBrandModalOpen(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>Manage Categories & Brands</span>
          </button>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand._id} value={brand.name}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <Table
        columns={columns}
        data={paginatedProducts}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      {/* Product Form Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={handleProductModalClose}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onClose={handleProductModalClose}
        />
      </Modal>

      {/* Category & Brand Management Modal */}
      <Modal
        isOpen={isCategoryBrandModalOpen}
        onClose={handleCategoryBrandModalClose}
        title="Manage Categories & Brands"
        size="xl"
      >
        <CategoryBrandManager
          activeTab={categoryBrandTab}
          onTabChange={setCategoryBrandTab}
        />
      </Modal>
    </div>
  );
};

export default Products;