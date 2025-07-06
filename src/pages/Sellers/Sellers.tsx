import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import SellerForm from './SellerForm';
import { deleteSeller, fetchSellers } from '../../store/slices/sellerSlice';
import Swal from 'sweetalert2';
import type { Seller } from '../../store/slices/sellerSlice';

const Sellers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sellers, isLoading } = useSelector((state: RootState) => state.sellers);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  // Filter and search logic
  const filteredSellers = useMemo(() => {
    return sellers.filter(seller => 
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.phone.includes(searchTerm)
    );
  }, [sellers, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
  const paginatedSellers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSellers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSellers, currentPage]);

  const handleEdit = (seller: Seller) => {
    setEditingSeller(seller);
    setIsModalOpen(true);
  };

  const handleDelete = async (sellerId: string) => {
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
        await dispatch(deleteSeller(sellerId)).unwrap();
        Swal.fire('Deleted!', 'Seller has been deleted.', 'success');
      }
    } catch (error: any) {
      Swal.fire('Error!', error.message || 'Failed to delete seller.', 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSeller(null);
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'address', header: 'Address' },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, seller: Seller) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(seller)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(seller._id)}
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
        <h1 className="text-3xl font-bold text-gray-900">Sellers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Seller</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredSellers.length} of {sellers.length} sellers
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <Table
        columns={columns}
        data={paginatedSellers}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      {/* Seller Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingSeller ? 'Edit Seller' : 'Add New Seller'}
        size="md"
      >
        <SellerForm
          seller={editingSeller}
          onClose={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Sellers;