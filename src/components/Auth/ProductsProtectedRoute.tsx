import React from 'react';
import { useProductsAuth } from '../../hooks/useProductsAuth';
import ProductsAuth from './ProductsAuth';
import { Loader2 } from 'lucide-react';

interface ProductsProtectedRouteProps {
  children: React.ReactNode;
}

const ProductsProtectedRoute: React.FC<ProductsProtectedRouteProps> = ({ children }) => {
  const { isProductsAuthenticated, isLoading, setProductsAuthenticated } = useProductsAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking products access...</p>
        </div>
      </div>
    );
  }

  if (!isProductsAuthenticated) {
    return <ProductsAuth onAuthenticated={setProductsAuthenticated} />;
  }

  return <>{children}</>;
};

export default ProductsProtectedRoute;