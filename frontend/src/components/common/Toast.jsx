import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`fixed top-8 right-6 z-[10000]`}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300
        ${type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}
      >
        <span className="text-2xl">
          {type === 'success' ? '✅' : '❌'}
        </span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-3 text-lg font-bold hover:text-black"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
