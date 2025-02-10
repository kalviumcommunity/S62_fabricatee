import React from 'react';
import { XCircle } from 'lucide-react';

const ErrorComponent = ({ message = "Something went wrong" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <XCircle className="h-8 w-8 text-red-500 mb-3" />
      <p className="text-gray-800 font-medium">{message}</p>
    </div>
  );
};

export default ErrorComponent;