
import React from 'react';
import { Package } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-lavender-200 border-t-lavender-600 rounded-full animate-spin" />
        <Package className="absolute inset-0 m-auto w-6 h-6 text-lavender-600" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground">Tracking your shipment...</p>
        <p className="text-sm text-muted-foreground arabic">جاري تتبع شحنتك...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
