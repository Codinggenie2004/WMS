import React, { useState, useEffect } from 'react';
import { Grid3x3 } from 'lucide-react';
import { api, API_URL } from '../../utils/api';

const CreateSlots = ({ slots, onSlotsCreated, loading, setLoading, triggerRefresh }) => {
  const [selectedArea, setSelectedArea] = useState('');
  const [newSlotId, setNewSlotId] = useState('');
  const [bulkSlotCount, setBulkSlotCount] = useState(1);
  const [areas, setAreas] = useState([]);

  const fetchAreas = async () => {
    try {
      const response = await fetch(`${API_URL}/areas`);
      const data = await response.json();
      console.log('CreateSlots - Fetched areas:', data);
      setAreas(data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [triggerRefresh]);

  const handleCreateSingle = async () => {
    if (!selectedArea || !newSlotId.trim()) {
      alert('Please select area and enter slot ID');
      return;
    }

    setLoading(true);
    try {
      const response = await api.createSlot({ area: selectedArea, slotId: newSlotId });
      const data = await response.json();

      if (response.ok) {
        alert('Slot created successfully!');
        setNewSlotId('');
        onSlotsCreated();
      } else {
        alert(data.message || 'Failed to create slot');
      }
    } catch (error) {
      console.error('Error creating slot:', error);
      alert('Error creating slot');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBulk = async () => {
    if (!selectedArea || bulkSlotCount < 1) {
      alert('Please select area and enter valid count');
      return;
    }

    setLoading(true);
    try {
      const response = await api.createBulkSlots(selectedArea, bulkSlotCount);
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setBulkSlotCount(1);
        onSlotsCreated();
      } else {
        alert(data.message || 'Failed to create slots');
      }
    } catch (error) {
      console.error('Error creating slots:', error);
      alert('Error creating slots');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
      <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
        <Grid3x3 className="w-6 h-6" />
        Create Slots
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Select Area ({areas.length} available)
        </label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          disabled={loading || areas.length === 0}
        >
          <option value="">-- Select Area --</option>
          {areas.sort((a, b) => a.name.localeCompare(b.name)).map(area => (
            <option key={area._id} value={area.name}>
              {area.name}
            </option>
          ))}
        </select>
        {areas.length === 0 && (
          <p className="text-sm text-amber-400 mt-2">⚠ No areas available. Create an area first.</p>
        )}
      </div>

      <div className="mb-6 p-4 bg-slate-900 rounded-lg">
        <h3 className="font-medium mb-3">Create Single Slot</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newSlotId}
            onChange={(e) => setNewSlotId(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            placeholder="Enter slot ID (e.g., K-1)"
            disabled={loading || !selectedArea}
          />
          <button
            onClick={handleCreateSingle}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
            disabled={loading || !selectedArea}
          >
            Create Slot
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-900 rounded-lg">
        <h3 className="font-medium mb-3">Create Multiple Slots</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            value={bulkSlotCount}
            onChange={(e) => setBulkSlotCount(parseInt(e.target.value) || 1)}
            className="w-full sm:w-32 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            min="1"
            max="50"
            disabled={loading || !selectedArea}
          />
          <button
            onClick={handleCreateBulk}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
            disabled={loading || !selectedArea}
          >
            Create {bulkSlotCount} Slot{bulkSlotCount > 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSlots;