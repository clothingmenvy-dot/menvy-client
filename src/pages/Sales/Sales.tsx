import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { Plus, Edit, Trash2, Search, Printer } from 'lucide-react';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import SaleForm from './SaleForm';
import { deleteSale, fetchSales } from '../../store/slices/saleSlice';
import Swal from 'sweetalert2';
import type { Sale } from '../../store/slices/saleSlice';

const Sales: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sales, isLoading } = useSelector((state: RootState) => state.sales);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch]);

  // Filter and search logic
  const filteredSales = useMemo(() => {
    return sales.filter(sale => 
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.sellerName?.toLowerCase().includes(searchTerm.toLowerCase() || '')
    );
  }, [sales, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSales, currentPage]);

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleDelete = async (saleId: string) => {
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
        await dispatch(deleteSale(saleId)).unwrap();
        Swal.fire('Deleted!', 'Sale has been deleted.', 'success');
      }
    } catch (error: any) {
      Swal.fire('Error!', error.message || 'Failed to delete sale.', 'error');
    }
  };

  const handlePrint = (sale: Sale) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Sale Receipt</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                width: 300px;
                margin: 20px auto;
                text-align: center;
                font-size: 12px;
                line-height: 1.5;
              }
              .receipt {
                border: 1px dashed #000;
                padding: 10px;
              }
              .header {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .divider {
                border-top: 1px dashed #000;
                margin: 10px 0;
              }
              .item {
                display: flex;
                justify-content: space-between;
              }
              .footer {
                margin-top: 10px;
                font-size: 10px;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">Supermarket Receipt</div>
              <div>Sale ID: ${sale._id}</div>
              <div>Date: ${new Date(sale.createdAt).toLocaleString()}</div>
              <div>Seller: ${sale.sellerName || 'N/A'}</div>
              <div class="divider"></div>
              <div class="item">
                <span>Product:</span>
                <span>${sale.productName}</span>
              </div>
              <div class="item">
                <span>Quantity:</span>
                <span>${sale.quantity.toLocaleString()}</span>
              </div>
              <div class="item">
                <span>Unit Price:</span>
                <span>$${sale.price.toFixed(2)}</span>
              </div>
              <div class="item">
                <span>Total:</span>
                <span>$${sale.total.toFixed(2)}</span>
              </div>
              <div class="divider"></div>
              <div class="footer">Thank you for shopping with us!</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      Swal.fire('Error!', 'Failed to open print window.', 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSale(null);
  };

  const columns = [
    { key: 'productName', header: 'Product' },
    { key: 'sellerName', header: 'Seller' },
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
      header: 'Sale Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, sale: Sale) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(sale)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(sale._id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePrint(sale)}
            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Record Sale</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredSales.length} of {sales.length} sales
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            Total Revenue: ${sales.reduce((acc, sale) => acc + sale.total, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <Table
        columns={columns}
        data={paginatedSales}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      {/* Sale Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingSale ? 'Edit Sale' : 'Record New Sale'}
        size="md"
      >
        <SaleForm
          sale={editingSale}
          onClose={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Sales;