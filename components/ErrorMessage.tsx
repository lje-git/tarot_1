import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="my-4 p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-md text-sm text-center">
      {message}
    </div>
  );
};
