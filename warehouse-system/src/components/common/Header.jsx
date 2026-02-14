import React from 'react';
import { Warehouse, LogOut, RefreshCw } from 'lucide-react';

const Header = ({ currentUser, onLogout, onRefresh, loading }) => {
  return (
    <div className="flex flex-col gap-3 mb-4 sm:mb-6">
      {/* Top row - Logo and user info */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Warehouse className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold truncate">WMS</h1>
          <p className="text-xs sm:text-sm text-slate-400 truncate">
            {currentUser.name} • {currentUser.role}
          </p>
        </div>
        {/* Mobile buttons */}
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 p-2 sm:px-3 sm:py-2 rounded-lg transition"
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline ml-2 text-sm">Refresh</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center justify-center bg-red-600 hover:bg-red-700 p-2 sm:px-3 sm:py-2 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline ml-2 text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;