import React from 'react';
import { Search } from 'lucide-react';

const EmptyState = ({ title = 'No results found', description = 'Try adjusting your search criteria or resetting active filters.', action }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center my-6 max-w-md mx-auto shadow-sm">
      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
        <Search className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-4">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
