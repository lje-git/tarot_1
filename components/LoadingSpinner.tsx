import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
      <span className="ml-2">Loading...</span>
    </div>
  );
};
