import React from 'react';

const SlotCard = ({ slot, product }) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition ${
        !slot.isEmpty
          ? 'bg-green-900/20 border-green-500'
          : 'bg-slate-900 border-slate-600'
      }`}
    >
      <div className="text-center">
        <div className="font-bold text-lg">{slot.slotId}</div>
        <div
          className={`text-xs mt-1 ${
            !slot.isEmpty ? 'text-green-400' : 'text-slate-500'
          }`}
        >
          {!slot.isEmpty ? 'Occupied' : 'Available'}
        </div>
        {!slot.isEmpty && product && (
          <div className="text-xs text-slate-300 mt-2 truncate">
            {product.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotCard;