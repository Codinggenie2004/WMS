import React from 'react';
import SectionGrid from './SectionGrid';

const WarehouseView = ({ slots, products }) => {
  // Get unique areas from slots and sort alphabetically
  const uniqueAreas = Array.from(new Set(slots.map(s => s.area))).sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div className="space-y-6">
      {uniqueAreas.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
          <p className="text-slate-400">No warehouse sections available</p>
          <p className="text-slate-500 text-sm mt-2">Create areas and slots in "Manage Slots & Areas" tab</p>
        </div>
      ) : (
        uniqueAreas.map(areaName => (
          <SectionGrid
            key={areaName}
            sectionName={areaName}
            slots={slots}
            products={products}
          />
        ))
      )}
    </div>
  );
};

export default WarehouseView;