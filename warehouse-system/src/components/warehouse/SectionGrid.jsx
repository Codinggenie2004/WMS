import React from 'react';
import SlotCard from './SlotCard';

const SectionGrid = ({ sectionName, slots, products }) => {
  const sectionSlots = slots.filter(s => s.area === sectionName);
  const occupied = sectionSlots.filter(s => !s.isEmpty).length;
  const available = sectionSlots.length - occupied;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{sectionName}</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-green-400">Available: {available}</span>
          <span className="text-orange-400">Occupied: {occupied}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {sectionSlots.map(slot => {
          const product = products.find(p => p.productId === slot.productId);
          return <SlotCard key={slot._id} slot={slot} product={product} />;
        })}
      </div>
    </div>
  );
};

export default SectionGrid;