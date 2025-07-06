import { useState, useEffect } from 'react';

export const useProductsAuth = () => {
  const [isProductsAuthenticated, setIsProductsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkProductsAuth();
  }, []);

  const checkProductsAuth = () => {
    const authStatus = sessionStorage.getItem('productsAuth');
    const authTime = sessionStorage.getItem('productsAuthTime');
    
    if (authStatus === 'true' && authTime) {
      const authTimestamp = parseInt(authTime);
      const currentTime = Date.now();
      const authDuration = 30 * 60 * 1000; // 30 minutes
      
      if (currentTime - authTimestamp < authDuration) {
        setIsProductsAuthenticated(true);
      } else {
        // Auth expired, clear it
        clearProductsAuth();
      }
    }
    
    setIsLoading(false);
  };

  const setProductsAuthenticated = () => {
    setIsProductsAuthenticated(true);
    sessionStorage.setItem('productsAuth', 'true');
    sessionStorage.setItem('productsAuthTime', Date.now().toString());
  };

  const clearProductsAuth = () => {
    setIsProductsAuthenticated(false);
    sessionStorage.removeItem('productsAuth');
    sessionStorage.removeItem('productsAuthTime');
  };

  return {
    isProductsAuthenticated,
    isLoading,
    setProductsAuthenticated,
    clearProductsAuth,
    checkProductsAuth
  };
};