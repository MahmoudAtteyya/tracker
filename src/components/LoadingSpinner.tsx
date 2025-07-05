import React from 'react';
import { Package } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Enhanced Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center animate-pulse">
            <Package className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 arabic">
          جاري البحث عن شحنتك
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm arabic">
          يرجى الانتظار...
        </p>
      </div>

      {/* Loading dots */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
