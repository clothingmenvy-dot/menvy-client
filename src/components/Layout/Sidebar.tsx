/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  ShoppingBag,
  User,
  LogOut,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import { useProductsAuth } from '../../hooks/useProductsAuth';
import Swal from 'sweetalert2';
import logo from '../../assets/logo.png';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { clearProductsAuth } = useProductsAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/products', secure: true },
    { icon: Users, label: 'Sellers', path: '/sellers' },
    { icon: ShoppingCart, label: 'Sales', path: '/sales' },
    { icon: ShoppingBag, label: 'Purchases', path: '/purchases', secure: true },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out of your account',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#EF4444',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Clear products auth when logging out
        clearProductsAuth();
        await dispatch(logoutUser()).unwrap();
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to logout. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-white shadow-lg h-full w-64 fixed left-0 top-0 z-30 border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
            <img src={logo} alt="InventoryPro Logo" />
          <div>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-r-2 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'group-hover:text-gray-800'}`} />
                <span className="font-medium">{item.label}</span>
                {item.secure && (
                  <Shield className={`w-4 h-4 ml-auto ${isActive ? 'text-blue-600' : 'text-purple-500'}`} />
                )}
              </Link>
            );
          })}
        </div>

        <div className="px-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-700" />
            <span className="font-medium group-hover:text-red-700">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;