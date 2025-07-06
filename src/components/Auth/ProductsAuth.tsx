import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Shield, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface ProductsAuthProps {
  onAuthenticated: () => void;
}

interface ProductsAuthForm {
  username: string;
  password: string;
}

// Hardcoded credentials for products access (in production, this should be from a secure backend)
const PRODUCTS_CREDENTIALS = {
  username: 'admin',
  password: 'products123'
};

const ProductsAuth: React.FC<ProductsAuthProps> = ({ onAuthenticated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductsAuthForm>();

  const onSubmit = async (data: ProductsAuthForm) => {
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.username === PRODUCTS_CREDENTIALS.username && 
        data.password === PRODUCTS_CREDENTIALS.password) {
      // Store products authentication in sessionStorage
      sessionStorage.setItem('productsAuth', 'true');
      sessionStorage.setItem('productsAuthTime', Date.now().toString());
      onAuthenticated();
    } else {
      setError('Invalid credentials for products access');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Products Access</h2>
            <p className="mt-2 text-sm text-gray-600">
              Additional authentication required for products management
            </p>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Access Denied
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Products Username
                </label>
                <div className="mt-1 relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('username', {
                      required: 'Username is required',
                    })}
                    type="text"
                    autoComplete="username"
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Enter products username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Products Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="pl-10 pr-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="Enter products password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex">
                <Shield className="h-5 w-5 text-purple-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-800">
                    Enhanced Security
                  </h3>
                  <p className="mt-1 text-sm text-purple-700">
                    This additional layer protects sensitive product management features.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Products'
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Demo credentials: admin / products123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsAuth;