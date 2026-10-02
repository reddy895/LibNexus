import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="w-10 h-10 border-4 border-[#DFE8DC] border-t-[#042F32] rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-[#143F40]/80">{message}</p>
    </div>
  );
};

export default LoadingSpinner;

