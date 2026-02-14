import React from 'react';
import { Trash2 } from 'lucide-react';
import { api } from '../../utils/api';

const ManageExistingSlots = ({ slots, onSlotDeleted, loading, setLoading }) => {
  // Group slots by area and sort areas alphabetically
  const uniqueAreas = Array.from(new Set(slots.map(s => s.area))).sort((a, b) => 
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  const handleDelete = async (slotId, slotName) => {
    if (!window.confirm(`Are you sure you want to delete slot "${slotName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.deleteSlot(slotId);
      const data = await response.json();

      if (response.ok) {
        alert('Slot deleted successfully!');
        onSlotDeleted();
      } else {
        alert(data.message || 'Failed to delete slot');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Error deleting slot');
    } finally {
      setLoading(false);
    }
  };

  if (slots.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
        <p className="text-slate-400">No slots available</p>
        <p className="text-slate-500 text-sm mt-2">Create areas with slots above</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Manage Existing Slots</h2>
      <div className="space-y-4">
        {uniqueAreas.map(areaName => {
          const areaSlots = slots.filter(s => s.area === areaName).sort((a, b) => 
            a.slotId.localeCompare(b.slotId, undefined, { numeric: true })
          );
          const emptySlots = areaSlots.filter(s => s.isEmpty);

          return (
            <div key={areaName} className="border border-slate-700 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <h3 className="font-medium text-base sm:text-lg">{areaName}</h3>
                <span className="text-xs sm:text-sm text-slate-400">
                  {areaSlots.length} slots ({emptySlots.length} empty, {areaSlots.length - emptySlots.length} occupied)
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {areaSlots.map(slot => (
                  <div
                    key={slot._id}
                    className={`p-2 sm:p-3 rounded-lg border ${
                      slot.isEmpty
                        ? 'bg-slate-900 border-slate-600'
                        : 'bg-green-900/20 border-green-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{slot.slotId}</span>
                      {slot.isEmpty && (
                        <button
                          onClick={() => handleDelete(slot._id, slot.slotId)}
                          className="text-red-400 hover:text-red-300 text-xs"
                          disabled={loading}
                          title="Delete slot"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        slot.isEmpty ? 'text-slate-500' : 'text-green-400'
                      }`}
                    >
                      {slot.isEmpty ? 'Empty' : 'Occupied'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageExistingSlots;