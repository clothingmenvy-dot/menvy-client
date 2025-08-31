/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import logo from '../../assets/logo.png';

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

  // === Search & Filter ===
  const filteredSales = useMemo(() => {
    return sales.filter(sale =>
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.sellerName && sale.sellerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sale.bill_no && sale.bill_no.toLowerCase().includes(searchTerm.toLowerCase())) // ✅ Search by bill_no
    );
  }, [sales, searchTerm]);

  // === Pagination ===
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

  // === Professional Receipt Print ===
  const handlePrint = (sale: Sale) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Menvy Sale Receipt</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap');
              
              body {
                font-family: 'Roboto Mono', monospace;
                width: 80mm;
                margin: 0 auto;
                font-size: 12px;
                line-height: 1.3;
                padding: 5px;
                background-color: white;
                color: #000;
              }
              .receipt { 
                border: 1px solid #ddd;
                padding: 15px;
                box-shadow: 0 0 5px rgba(0,0,0,0.1);
              }
              .header { 
                text-align: center; 
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px dashed #ccc;
              }
              .header img { 
                max-width: 70px; 
                margin-bottom: 5px; 
              }
              .shop-name { 
                font-size: 18px; 
                font-weight: bold; 
                letter-spacing: 1px;
                margin-bottom: 3px;
              }
              .address {
                font-size: 10px;
                margin-bottom: 3px;
              }
              .contact {
                font-size: 10px;
                margin-bottom: 5px;
              }
              .divider { 
                border-top: 1px dashed #ccc; 
                margin: 8px 0; 
              }
              .double-divider {
                border-top: 2px double #000;
                margin: 10px 0;
              }
              .item { 
                display: flex; 
                justify-content: space-between;
                margin-bottom: 3px;
              }
              .item-details {
                margin: 5px 0;
                padding: 5px 0;
                border-bottom: 1px dotted #eee;
              }
              .text-center {
                text-align: center;
              }
              .text-right {
                text-align: right;
              }
              .bold {
                font-weight: bold;
              }
              .footer { 
                margin-top: 10px; 
                font-size: 10px; 
                text-align: center; 
                border-top: 1px dashed #ccc;
                padding-top: 10px;
              }
              .terms { 
                margin-top: 10px; 
                font-size: 9px; 
                border-top: 1px dashed #ccc; 
                padding-top: 5px; 
              }
              .qr-code {
                width: 70px;
                height: 70px;
                margin: 5px auto;
                display: block;
              }
              .thank-you {
                font-style: italic;
                margin: 8px 0;
              }
              .vat-number {
                font-size: 9px;
                margin: 3px 0;
              }
            </style>
          </head>
          <body onload="window.print();">
            <div class="receipt">
              <!-- Header -->
              <div class="header">
                <img src="${logo}" alt="Menvy Logo" />
                <div class="address">Magura, Bangladesh</div>
                <div class="contact">Phone: 01708-446607</div>
                <div class="contact">Email: contact@menvy.store</div>
                <div class="vat-number">VAT Reg No: 0xxxxxxxxxxxx</div>
              </div>
              
              <!-- Transaction Details -->
              <div class="divider"></div>
              <div class="item">
                <span>Bill No:</span>
                <span>${sale.bill_no}</span>
              </div>
              <div class="item">
                <span>Date:</span>
                <span>${new Date(sale.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="item">
                <span>Time:</span>
                <span>${new Date(sale.createdAt).toLocaleTimeString()}</span>
              </div>
              <div class="item">
                <span>Seller:</span>
                <span>${sale.sellerName || 'Menvy Staff'}</span>
              </div>
              
              <div class="double-divider"></div>
              
              <!-- Product Details -->
              <div class="item-details">
                <div class="item">
                  <span class="bold">Description</span>
                  <span class="bold">Amount</span>
                </div>
                <div class="item">
                  <span>${sale.productName}</span>
                  <span></span>
                </div>
                <div class="item">
                  <span>Qty: ${sale.quantity} × ৳${sale.price.toFixed(2)}</span>
                  <span>৳${sale.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div class="double-divider"></div>
              
              <!-- Payment Summary -->
              <div class="item">
                <span>Subtotal:</span>
                <span>৳${sale.total.toFixed(2)}</span>
              </div>
              <div class="item">
                <span>VAT (10%):</span>
                <span>৳${(sale.total * 0.10).toFixed(2)}</span>
              </div>
              <div class="item">
                <span class="bold">Net Payable:</span>
                <span class="bold">৳${(sale.total * 1.10).toFixed(2)}</span>
              </div>
              
              <div class="double-divider"></div>
              
              <!-- Thank You Message -->
              <div class="thank-you text-center">
                Thank you for shopping at Menvy!
              </div>
              
              <!-- QR Code -->
              <div class="text-center">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https://www.facebook.com/share/1GXzYW2ur7/?mibextid=wwXIfr" 
                     alt="QR Code" class="qr-code" />
                <div>Follow us on Facebook</div>
              </div>
              
              <!-- Terms & Conditions -->
              <div class="terms">
                <div class="bold">Terms & Conditions:</div>
                <div># Product can be exchanged but not refunded.</div>
                <div># Exchange within 10 days with original condition.</div>
                <div># Original receipt required for exchange.</div>
                <div># Discounted items cannot be exchanged.</div>
                <div># Subject to Menvy sales policies.</div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <div>${new Date().getFullYear()} © Menvy. All rights reserved.</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      Swal.fire('Error!', 'Failed to open print window.', 'error');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSale(null);
  };

  // === Table Columns ===
  const columns = [
    { 
      key: 'bill_no', 
      header: 'Bill No',
      render: (value: string) => value
    },
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
      render: (value: number) => `৳${value.toFixed(2)}`
    },
    {
      key: 'total',
      header: 'Total',
      render: (value: number) => `৳${value.toFixed(2)}`
    },
    {
      key: 'createdAt',
      header: 'Sale Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: any, sale: Sale) => (
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
              placeholder="Search sales by product, seller, or bill no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredSales.length} of {sales.length} sales
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            Total Revenue: ৳{sales.reduce((acc, sale) => acc + sale.total, 0).toLocaleString()}
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
