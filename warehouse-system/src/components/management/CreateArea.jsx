import React, { useState } from 'react';
import { Warehouse } from 'lucide-react';
import { API_URL } from '../../utils/api';

const CreateArea = ({ onAreaCreated, loading, setLoading }) => {
  const [newAreaName, setNewAreaName] = useState('');
  const [autoCreateSlots, setAutoCreateSlots] = useState(true);
  const [slotCount, setSlotCount] = useState(6);

  const handleCreate = async () => {
    if (!newAreaName.trim()) {
      alert('Please enter area name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/area`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAreaName,
          createSlots: autoCreateSlots,
          slotCount: autoCreateSlots ? slotCount : 0
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message + (data.slotsCreated ? `\n${data.slotsCreated} slots created` : ''));
        setNewAreaName('');
        setSlotCount(6);
        onAreaCreated();
      } else {
        alert(data.message || 'Failed to create area');
      }
    } catch (error) {
      console.error('Error creating area:', error);
      alert('Error creating area');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
      <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
        <Warehouse className="w-6 h-6" />
        Create New Area
      </h2>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter area name (e.g., Section E)"
            disabled={loading}
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
            disabled={loading}
          >
            Create Area
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCreateSlots}
              onChange={(e) => setAutoCreateSlots(e.target.checked)}
              className="w-4 h-4"
              disabled={loading}
            />
            <span className="text-slate-300">Auto-create slots</span>
          </label>

          {autoCreateSlots && (
            <div className="flex items-center gap-2">
              <label className="text-slate-400">Number of slots:</label>
              <input
                type="number"
                value={slotCount}
                onChange={(e) => setSlotCount(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                min="1"
                max="50"
                disabled={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateArea;