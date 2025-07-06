import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import PurchaseForm from './PurchaseForm';
import { deletePurchase, fetchPurchases } from '../../store/slices/purchaseSlice';
import Swal from 'sweetalert2';
import type { Purchase } from '../../store/slices/purchaseSlice';

const Purchases: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { purchases, isLoading } = useSelector((state: RootState) => state.purchases);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  // Filter and search logic
  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase =>
      purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplierName?.toLowerCase().includes(searchTerm.toLowerCase() || '')
    );
  }, [purchases, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const paginatedPurchases = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPurchases.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPurchases, currentPage]);

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDelete = async (purchaseId: string) => {
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
        await dispatch(deletePurchase(purchaseId)).unwrap();
        Swal.fire('Deleted!', 'Purchase has been deleted.', 'success');
      }
    } catch (error: any) {
      Swal.fire('Error!', error.message || 'Failed to delete purchase.', 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const columns = [
    { key: 'productName', header: 'Product' },
    { key: 'supplierName', header: 'Supplier' },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'price',
      header: 'Unit Price',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'total',
      header: 'Total',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'createdAt',
      header: 'Purchase Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, purchase: Purchase) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(purchase)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(purchase._id)}
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
        <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Record Purchase</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredPurchases.length} of {purchases.length} purchases
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Total Expenses: ${purchases.reduce((acc, purchase) => acc + purchase.total, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <Table
        columns={columns}
        data={paginatedPurchases}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      {/* Purchase Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingPurchase ? 'Edit Purchase' : 'Record New Purchase'}
        size="md"
      >
        <PurchaseForm
          purchase={editingPurchase}
          onClose={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Purchases;