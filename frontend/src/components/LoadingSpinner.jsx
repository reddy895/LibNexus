import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-[#9F2D2D] rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
