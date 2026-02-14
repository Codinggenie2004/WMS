import React from 'react';

const TabButton = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-medium transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
};

export default TabButton;