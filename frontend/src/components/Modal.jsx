import React from 'react';
import { FiX } from "react-icons/fi";

const Modal = ({ children, setIsOpen }) => {
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full overflow-auto max-h-[100vh] max-w-lg rounded-lg bg-white p-6 shadow-lg sm:p-8">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close modal"
        >
          <FiX size={20} />
        </button>
        
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;