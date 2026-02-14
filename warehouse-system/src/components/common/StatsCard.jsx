import React from 'react';

const StatsCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs sm:text-sm truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-bold truncate">{value}</p>
        </div>
        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${color} flex-shrink-0`} />
      </div>
    </div>
  );
};

export default StatsCard;